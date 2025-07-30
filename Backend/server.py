import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import bcrypt

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'], supports_credentials=True)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key')

# Database connection
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'art_space')
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

@app.route('/dashboard/stats/test', methods=['GET'])
def get_dashboard_stats_test():
    """Test endpoint that doesn't require authentication"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get a test user ID (first user in the system)
        cursor.execute('SELECT id FROM users LIMIT 1')
        user_result = cursor.fetchone()
        
        if not user_result:
            return jsonify({'error': 'No users found in database'}), 404
        
        user_id = user_result['id']
        print(f"Testing dashboard stats for user_id: {user_id}")
        
        # Get total counts
        cursor.execute('SELECT COUNT(*) as total_categories FROM categories WHERE created_by = %s', (user_id,))
        total_categories = cursor.fetchone()['total_categories']
        
        cursor.execute('SELECT COUNT(*) as total_artists FROM artists WHERE created_by = %s', (user_id,))
        total_artists = cursor.fetchone()['total_artists']
        
        cursor.execute('SELECT COUNT(*) as total_artworks FROM artworks WHERE created_by = %s', (user_id,))
        total_artworks = cursor.fetchone()['total_artworks']
        
        cursor.execute('SELECT COALESCE(SUM(price), 0) as total_value FROM artworks WHERE created_by = %s', (user_id,))
        total_value = cursor.fetchone()['total_value']
        # Convert Decimal to float
        if hasattr(total_value, '__float__'):
            total_value = float(total_value)
        
        result = {
            'total_categories': total_categories,
            'total_artists': total_artists,
            'total_artworks': total_artworks,
            'total_value': total_value,
            'artworks_by_category': [],
            'recent_artworks': [],
            'monthly_artworks': []
        }
        
        cursor.close()
        conn.close()
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Test dashboard stats error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        print(f"Fetching dashboard stats for user_id: {user_id}")
        
        # Get total counts
        try:
            cursor.execute('SELECT COUNT(*) as total_categories FROM categories WHERE created_by = %s', (user_id,))
            total_categories = cursor.fetchone()['total_categories']
            print(f"Total categories: {total_categories}")
        except Exception as e:
            print(f"Error getting categories count: {e}")
            total_categories = 0
        
        try:
            cursor.execute('SELECT COUNT(*) as total_artists FROM artists WHERE created_by = %s', (user_id,))
            total_artists = cursor.fetchone()['total_artists']
            print(f"Total artists: {total_artists}")
        except Exception as e:
            print(f"Error getting artists count: {e}")
            total_artists = 0
        
        try:
            cursor.execute('SELECT COUNT(*) as total_artworks FROM artworks WHERE created_by = %s', (user_id,))
            total_artworks = cursor.fetchone()['total_artworks']
            print(f"Total artworks: {total_artworks}")
        except Exception as e:
            print(f"Error getting artworks count: {e}")
            total_artworks = 0
        
        # Get total value of artworks
        try:
            cursor.execute('SELECT COALESCE(SUM(price), 0) as total_value FROM artworks WHERE created_by = %s', (user_id,))
            total_value = cursor.fetchone()['total_value']
            # Convert Decimal to float
            if hasattr(total_value, '__float__'):
                total_value = float(total_value)
            print(f"Total value: {total_value}")
        except Exception as e:
            print(f"Error getting total value: {e}")
            total_value = 0.0
        
        # Get artworks by category
        try:
            cursor.execute('''
                SELECT c.name as category_name, COUNT(a.id) as artwork_count 
                FROM categories c 
                LEFT JOIN artworks a ON c.id = a.category_id AND a.created_by = %s
                WHERE c.created_by = %s 
                GROUP BY c.id, c.name
                ORDER BY artwork_count DESC
            ''', (user_id, user_id))
            artworks_by_category = cursor.fetchall()
            print(f"Artworks by category: {len(artworks_by_category)} categories")
        except Exception as e:
            print(f"Error getting artworks by category: {e}")
            artworks_by_category = []
        
        # Get recent artworks (last 5)
        try:
            cursor.execute('''
                SELECT a.title, a.price, c.name as category_name, ar.name as artist_name, a.created_at
                FROM artworks a 
                LEFT JOIN categories c ON a.category_id = c.id 
                LEFT JOIN artists ar ON a.artist_id = ar.id 
                WHERE a.created_by = %s 
                ORDER BY a.created_at DESC 
                LIMIT 5
            ''', (user_id,))
            recent_artworks = cursor.fetchall()
            # Convert Decimal prices to float
            for artwork in recent_artworks:
                if 'price' in artwork and hasattr(artwork['price'], '__float__'):
                    artwork['price'] = float(artwork['price'])
            print(f"Recent artworks: {len(recent_artworks)} artworks")
        except Exception as e:
            print(f"Error getting recent artworks: {e}")
            recent_artworks = []
        
        # Get monthly artwork additions (last 6 months)
        try:
            cursor.execute('''
                SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
                FROM artworks 
                WHERE created_by = %s 
                AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
            ''', (user_id,))
            monthly_artworks = cursor.fetchall()
            print(f"Monthly artworks: {len(monthly_artworks)} months")
        except Exception as e:
            print(f"Error getting monthly artworks: {e}")
            monthly_artworks = []
        
        result = {
            'total_categories': total_categories,
            'total_artists': total_artists,
            'total_artworks': total_artworks,
            'total_value': total_value,
            'artworks_by_category': artworks_by_category,
            'recent_artworks': recent_artworks,
            'monthly_artworks': monthly_artworks
        }
        
        print("Dashboard stats generated successfully")
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Dashboard stats error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Server is running!'}), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    if not all([name, email, password, role]):
        return jsonify({'error': 'Missing fields'}), 400
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE email=%s', (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 409
        cursor.execute('INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s)',
                       (name, email, hashed, role))
        conn.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not all([email, password]):
        return jsonify({'error': 'Missing fields'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT id, name, email, password_hash, role FROM users WHERE email=%s', (email,))
        user = cursor.fetchone()
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401
        session['user_id'] = user['id']
        session['role'] = user['role']
        return jsonify({'message': 'Login successful', 'role': user['role'], 'name': user['name']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200

@app.route('/dashboard', methods=['GET'])
def dashboard():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    role = session.get('role')
    if role == 'artist':
        return jsonify({'dashboard': 'artist', 'message': 'Welcome, artist!'}), 200
    elif role == 'user':
        return jsonify({'dashboard': 'collector', 'message': 'Welcome, collector!'}), 200
    else:
        return jsonify({'error': 'Unknown role'}), 400

# Categories endpoints
@app.route('/categories', methods=['GET'])
def get_categories():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM categories ORDER BY created_at DESC')
        categories = cursor.fetchall()
        return jsonify({'categories': categories}), 200
    except Exception as e:
        print(f"Categories error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/categories', methods=['POST'])
def create_category():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    name = data.get('name')
    description = data.get('description', '')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO categories (name, description, created_by) VALUES (%s, %s, %s)',
                       (name, description, session['user_id']))
        conn.commit()
        return jsonify({'message': 'Category created successfully'}), 201
    except Exception as e:
        print(f"Create category error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    name = data.get('name')
    description = data.get('description', '')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE categories SET name=%s, description=%s WHERE id=%s',
                       (name, description, category_id))
        conn.commit()
        return jsonify({'message': 'Category updated successfully'}), 200
    except Exception as e:
        print(f"Update category error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM categories WHERE id=%s', (category_id,))
        conn.commit()
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as e:
        print(f"Delete category error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Artists endpoints
@app.route('/artists', methods=['GET'])
def get_artists():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM artists ORDER BY created_at DESC')
        artists = cursor.fetchall()
        return jsonify({'artists': artists}), 200
    except Exception as e:
        print(f"Artists error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/artists', methods=['POST'])
def create_artist():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    name = data.get('name')
    bio = data.get('bio', '')
    email = data.get('email', '')
    phone = data.get('phone', '')
    website = data.get('website', '')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO artists (name, bio, email, phone, website, created_by) VALUES (%s, %s, %s, %s, %s, %s)',
                       (name, bio, email, phone, website, session['user_id']))
        conn.commit()
        return jsonify({'message': 'Artist created successfully'}), 201
    except Exception as e:
        print(f"Create artist error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/artists/<int:artist_id>', methods=['PUT'])
def update_artist(artist_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    name = data.get('name')
    bio = data.get('bio', '')
    email = data.get('email', '')
    phone = data.get('phone', '')
    website = data.get('website', '')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE artists SET name=%s, bio=%s, email=%s, phone=%s, website=%s WHERE id=%s',
                       (name, bio, email, phone, website, artist_id))
        conn.commit()
        return jsonify({'message': 'Artist updated successfully'}), 200
    except Exception as e:
        print(f"Update artist error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/artists/<int:artist_id>', methods=['DELETE'])
def delete_artist(artist_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM artists WHERE id=%s', (artist_id,))
        conn.commit()
        return jsonify({'message': 'Artist deleted successfully'}), 200
    except Exception as e:
        print(f"Delete artist error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Artworks endpoints
@app.route('/artworks', methods=['GET'])
def get_artworks():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT a.*, c.name as category_name, ar.name as artist_name 
            FROM artworks a 
            LEFT JOIN categories c ON a.category_id = c.id 
            LEFT JOIN artists ar ON a.artist_id = ar.id 
            ORDER BY a.created_at DESC
        ''')
        artworks = cursor.fetchall()
        
        # Convert Decimal prices to float
        for artwork in artworks:
            if 'price' in artwork and hasattr(artwork['price'], '__float__'):
                artwork['price'] = float(artwork['price'])
        
        return jsonify({'artworks': artworks}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/artworks', methods=['POST'])
def create_artwork():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    price = data.get('price', 0)
    image_url = data.get('image_url', '')
    category_id = data.get('category_id')
    artist_id = data.get('artist_id')
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO artworks (title, description, price, image_url, category_id, artist_id, created_by) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                       (title, description, price, image_url, category_id, artist_id, session['user_id']))
        conn.commit()
        return jsonify({'message': 'Artwork created successfully'}), 201
    except Exception as e:
        print(f"Create artwork error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/artworks/<int:artwork_id>', methods=['PUT'])
def update_artwork(artwork_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    price = data.get('price', 0)
    image_url = data.get('image_url', '')
    category_id = data.get('category_id')
    artist_id = data.get('artist_id')
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE artworks SET title=%s, description=%s, price=%s, image_url=%s, category_id=%s, artist_id=%s WHERE id=%s',
                       (title, description, price, image_url, category_id, artist_id, artwork_id))
        conn.commit()
        return jsonify({'message': 'Artwork updated successfully'}), 200
    except Exception as e:
        print(f"Update artwork error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/artworks/<int:artwork_id>', methods=['DELETE'])
def delete_artwork(artwork_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM artworks WHERE id=%s', (artwork_id,))
        conn.commit()
        return jsonify({'message': 'Artwork deleted successfully'}), 200
    except Exception as e:
        print(f"Delete artwork error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)

