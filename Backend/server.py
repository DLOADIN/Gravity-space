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

@app.route('/dashboard/artist-stats', methods=['GET'])
def get_artist_dashboard_stats():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        print(f"Fetching artist dashboard stats for user_id: {user_id}")
        
        # Get total artworks by this artist
        cursor.execute('SELECT COUNT(*) as total_artworks FROM artworks WHERE created_by = %s', (user_id,))
        total_artworks = cursor.fetchone()['total_artworks']
        
        # Get total sales (completed transactions where artist is seller)
        cursor.execute('''
            SELECT COUNT(*) as total_sales, COALESCE(SUM(amount), 0) as total_earnings
            FROM transactions t
            JOIN artworks a ON t.artwork_id = a.id
            WHERE a.created_by = %s AND t.status = 'completed'
        ''', (user_id,))
        sales_data = cursor.fetchone()
        total_sales = sales_data['total_sales']
        total_earnings = sales_data['total_earnings']
        if hasattr(total_earnings, '__float__'):
            total_earnings = float(total_earnings)
        
        # Get artworks by category
        cursor.execute('''
            SELECT c.name as category_name, COUNT(a.id) as artwork_count 
            FROM categories c 
            LEFT JOIN artworks a ON c.id = a.category_id AND a.created_by = %s
            WHERE c.created_by = %s 
            GROUP BY c.id, c.name
            ORDER BY artwork_count DESC
        ''', (user_id, user_id))
        artworks_by_category = cursor.fetchall()
        
        # Get recent artworks
        cursor.execute('''
            SELECT a.title, a.price, c.name as category_name, a.status, a.created_at
            FROM artworks a 
            LEFT JOIN categories c ON a.category_id = c.id 
            WHERE a.created_by = %s 
            ORDER BY a.created_at DESC 
            LIMIT 5
        ''', (user_id,))
        recent_artworks = cursor.fetchall()
        for artwork in recent_artworks:
            if 'price' in artwork and hasattr(artwork['price'], '__float__'):
                artwork['price'] = float(artwork['price'])
        
        # Get monthly sales
        cursor.execute('''
            SELECT DATE_FORMAT(t.transaction_date, '%Y-%m') as month, COUNT(*) as count
            FROM transactions t
            JOIN artworks a ON t.artwork_id = a.id
            WHERE a.created_by = %s AND t.status = 'completed'
            AND t.transaction_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(t.transaction_date, '%Y-%m')
            ORDER BY month
        ''', (user_id,))
        monthly_sales = cursor.fetchall()
        
        result = {
            'total_artworks': total_artworks,
            'total_sales': total_sales,
            'total_earnings': total_earnings,
            'artworks_by_category': artworks_by_category,
            'recent_artworks': recent_artworks,
            'monthly_sales': monthly_sales
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Artist dashboard stats error: {e}")
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
        return jsonify({
            'message': 'Login successful', 
            'role': user['role'], 
            'name': user['name'],
            'id': user['id']
        }), 200
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

@app.route('/artworks/my-artworks', methods=['GET'])
def get_my_artworks():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        cursor.execute('''
            SELECT a.*, c.name as category_name 
            FROM artworks a 
            LEFT JOIN categories c ON a.category_id = c.id 
            WHERE a.created_by = %s
            ORDER BY a.created_at DESC
        ''', (user_id,))
        artworks = cursor.fetchall()
        
        # Convert Decimal prices to float
        for artwork in artworks:
            if 'price' in artwork and hasattr(artwork['price'], '__float__'):
                artwork['price'] = float(artwork['price'])
        
        return jsonify({'artworks': artworks}), 200
    except Exception as e:
        print(f"My artworks error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/transactions', methods=['GET'])
def get_transactions():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        cursor.execute('''
            SELECT t.*, a.title as artwork_title, 
                   CASE 
                       WHEN t.buyer_id = %s THEN 'You'
                       ELSE u1.name 
                   END as buyer_name,
                   CASE 
                       WHEN t.seller_id = %s THEN 'You'
                       ELSE u2.name 
                   END as seller_name
            FROM transactions t
            JOIN artworks a ON t.artwork_id = a.id
            JOIN users u1 ON t.buyer_id = u1.id
            JOIN users u2 ON t.seller_id = u2.id
            WHERE t.buyer_id = %s OR t.seller_id = %s
            ORDER BY t.transaction_date DESC
        ''', (user_id, user_id, user_id, user_id))
        transactions = cursor.fetchall()
        
        # Convert Decimal amounts to float
        for transaction in transactions:
            if 'amount' in transaction and hasattr(transaction['amount'], '__float__'):
                transaction['amount'] = float(transaction['amount'])
        
        return jsonify({'transactions': transactions}), 200
    except Exception as e:
        print(f"Transactions error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/transactions', methods=['POST'])
def create_transaction():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    artwork_id = data.get('artwork_id')
    amount = data.get('amount')
    payment_method = data.get('payment_method', 'credit_card')
    notes = data.get('notes', '')
    
    if not artwork_id or not amount:
        return jsonify({'error': 'Artwork ID and amount are required'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        buyer_id = session['user_id']
        
        # Get artwork details and seller
        cursor.execute('SELECT created_by, price FROM artworks WHERE id = %s AND status = "available"', (artwork_id,))
        artwork = cursor.fetchone()
        
        if not artwork:
            return jsonify({'error': 'Artwork not found or not available'}), 404
        
        seller_id = artwork['created_by']
        
        if buyer_id == seller_id:
            return jsonify({'error': 'Cannot buy your own artwork'}), 400
        
        # Create transaction
        cursor.execute('''
            INSERT INTO transactions (buyer_id, seller_id, artwork_id, amount, payment_method, notes, status)
            VALUES (%s, %s, %s, %s, %s, %s, 'completed')
        ''', (buyer_id, seller_id, artwork_id, amount, payment_method, notes))
        
        # Update artwork status to sold
        cursor.execute('UPDATE artworks SET status = "sold" WHERE id = %s', (artwork_id,))
        
        conn.commit()
        
        return jsonify({'message': 'Transaction completed successfully'}), 201
    except Exception as e:
        print(f"Create transaction error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/transactions/my-transactions', methods=['GET'])
def get_my_transactions():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        cursor.execute('''
            SELECT t.*, a.title as artwork_title, 
                   CASE 
                       WHEN t.buyer_id = %s THEN 'You'
                       ELSE u1.name 
                   END as buyer_name,
                   CASE 
                       WHEN t.seller_id = %s THEN 'You'
                       ELSE u2.name 
                   END as seller_name
            FROM transactions t
            JOIN artworks a ON t.artwork_id = a.id
            JOIN users u1 ON t.buyer_id = u1.id
            JOIN users u2 ON t.seller_id = u2.id
            WHERE t.buyer_id = %s OR t.seller_id = %s
            ORDER BY t.transaction_date DESC
        ''', (user_id, user_id, user_id, user_id))
        transactions = cursor.fetchall()
        
        # Convert Decimal amounts to float
        for transaction in transactions:
            if 'amount' in transaction and hasattr(transaction['amount'], '__float__'):
                transaction['amount'] = float(transaction['amount'])
        
        return jsonify({'transactions': transactions}), 200
    except Exception as e:
        print(f"My transactions error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/marketplace/available', methods=['GET'])
def get_marketplace_artworks():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        cursor.execute('''
            SELECT a.*, c.name as category_name, ar.name as artist_name, u.name as seller_name
            FROM artworks a 
            LEFT JOIN categories c ON a.category_id = c.id 
            LEFT JOIN artists ar ON a.artist_id = ar.id
            LEFT JOIN users u ON a.created_by = u.id
            WHERE a.status = 'available' AND a.created_by != %s
            ORDER BY a.created_at DESC
        ''', (user_id,))
        artworks = cursor.fetchall()
        
        # Convert Decimal prices to float
        for artwork in artworks:
            if 'price' in artwork and hasattr(artwork['price'], '__float__'):
                artwork['price'] = float(artwork['price'])
        
        return jsonify({'artworks': artworks}), 200
    except Exception as e:
        print(f"Marketplace artworks error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Portfolio routes
@app.route('/portfolio', methods=['GET'])
def get_portfolios():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        cursor.execute('''
            SELECT * FROM artist_portfolios 
            WHERE artist_id = %s 
            ORDER BY created_at DESC
        ''', (user_id,))
        portfolios = cursor.fetchall()
        
        return jsonify({'portfolios': portfolios}), 200
    except Exception as e:
        print(f"Get portfolios error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/portfolio/my-portfolio', methods=['GET'])
def get_my_portfolio():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        cursor.execute('''
            SELECT * FROM artist_portfolios 
            WHERE artist_id = %s 
            ORDER BY created_at DESC
        ''', (user_id,))
        portfolios = cursor.fetchall()
        
        return jsonify({'portfolios': portfolios}), 200
    except Exception as e:
        print(f"Get my portfolio error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/portfolio', methods=['POST'])
def create_portfolio():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        portfolio_type = data.get('portfolio_type', 'gallery')
        image_url = data.get('image_url')
        external_link = data.get('external_link')
        
        if not title:
            return jsonify({'error': 'Title is required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        cursor.execute('''
            INSERT INTO artist_portfolios (artist_id, title, description, portfolio_type, image_url, external_link)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (user_id, title, description, portfolio_type, image_url, external_link))
        
        portfolio_id = cursor.lastrowid
        conn.commit()
        
        # Get the created portfolio
        cursor.execute('SELECT * FROM artist_portfolios WHERE id = %s', (portfolio_id,))
        portfolio = cursor.fetchone()
        
        return jsonify({'portfolio': portfolio, 'message': 'Portfolio created successfully'}), 201
    except Exception as e:
        print(f"Create portfolio error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/portfolio/<int:portfolio_id>', methods=['PUT'])
def update_portfolio(portfolio_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        portfolio_type = data.get('portfolio_type')
        image_url = data.get('image_url')
        external_link = data.get('external_link')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        
        # Check if portfolio exists and belongs to user
        cursor.execute('SELECT * FROM artist_portfolios WHERE id = %s AND artist_id = %s', (portfolio_id, user_id))
        portfolio = cursor.fetchone()
        
        if not portfolio:
            return jsonify({'error': 'Portfolio not found'}), 404
        
        # Update portfolio
        update_fields = []
        update_values = []
        
        if title is not None:
            update_fields.append('title = %s')
            update_values.append(title)
        if description is not None:
            update_fields.append('description = %s')
            update_values.append(description)
        if portfolio_type is not None:
            update_fields.append('portfolio_type = %s')
            update_values.append(portfolio_type)
        if image_url is not None:
            update_fields.append('image_url = %s')
            update_values.append(image_url)
        if external_link is not None:
            update_fields.append('external_link = %s')
            update_values.append(external_link)
        
        if update_fields:
            update_values.append(portfolio_id)
            update_values.append(user_id)
            
            query = f'''
                UPDATE artist_portfolios 
                SET {', '.join(update_fields)}
                WHERE id = %s AND artist_id = %s
            '''
            cursor.execute(query, update_values)
            conn.commit()
        
        # Get updated portfolio
        cursor.execute('SELECT * FROM artist_portfolios WHERE id = %s', (portfolio_id,))
        updated_portfolio = cursor.fetchone()
        
        return jsonify({'portfolio': updated_portfolio, 'message': 'Portfolio updated successfully'}), 200
    except Exception as e:
        print(f"Update portfolio error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/portfolio/<int:portfolio_id>', methods=['DELETE'])
def delete_portfolio(portfolio_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        user_id = session['user_id']
        
        # Check if portfolio exists and belongs to user
        cursor.execute('SELECT * FROM artist_portfolios WHERE id = %s AND artist_id = %s', (portfolio_id, user_id))
        portfolio = cursor.fetchone()
        
        if not portfolio:
            return jsonify({'error': 'Portfolio not found'}), 404
        
        # Delete portfolio
        cursor.execute('DELETE FROM artist_portfolios WHERE id = %s AND artist_id = %s', (portfolio_id, user_id))
        conn.commit()
        
        return jsonify({'message': 'Portfolio deleted successfully'}), 200
    except Exception as e:
        print(f"Delete portfolio error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)

