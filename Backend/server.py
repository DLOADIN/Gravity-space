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
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)

