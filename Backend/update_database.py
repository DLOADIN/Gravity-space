import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'art_space')
}

def update_database():
    try:
        # Connect to the database
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Connected to database successfully!")
        
        # Check if status column exists in artworks table
        cursor.execute("SHOW COLUMNS FROM artworks LIKE 'status'")
        status_exists = cursor.fetchone()
        
        if not status_exists:
            print("Adding status column to artworks table...")
            cursor.execute("""
                ALTER TABLE artworks 
                ADD COLUMN status ENUM('available', 'sold', 'reserved') DEFAULT 'available'
            """)
            print("Status column added successfully!")
        else:
            print("Status column already exists in artworks table")
        
        # Check if transactions table exists
        cursor.execute("SHOW TABLES LIKE 'transactions'")
        transactions_exists = cursor.fetchone()
        
        if not transactions_exists:
            print("Creating transactions table...")
            cursor.execute("""
                CREATE TABLE transactions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    buyer_id INT NOT NULL,
                    seller_id INT NOT NULL,
                    artwork_id INT NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
                    payment_method VARCHAR(50),
                    notes TEXT,
                    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
                )
            """)
            print("Transactions table created successfully!")
        else:
            print("Transactions table already exists")
        
        # Check if artist_portfolios table exists
        cursor.execute("SHOW TABLES LIKE 'artist_portfolios'")
        portfolios_exists = cursor.fetchone()
        
        if not portfolios_exists:
            print("Creating artist_portfolios table...")
            cursor.execute('''
                CREATE TABLE artist_portfolios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    artist_id INT NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    image_url VARCHAR(500),
                    external_link VARCHAR(500),
                    portfolio_type ENUM('gallery', 'exhibition', 'award', 'publication') DEFAULT 'gallery',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
                )
            ''')
            print("Artist portfolios table created successfully!")
        else:
            print("Artist portfolios table already exists")
            
            # Check if external_link column exists
            cursor.execute("SHOW COLUMNS FROM artist_portfolios LIKE 'external_link'")
            external_link_exists = cursor.fetchone()
            
            if not external_link_exists:
                print("Adding external_link column to artist_portfolios table...")
                cursor.execute("ALTER TABLE artist_portfolios ADD COLUMN external_link VARCHAR(500)")
                print("external_link column added successfully!")
            else:
                print("external_link column already exists")
        
        # Update existing artworks to have 'available' status
        cursor.execute("UPDATE artworks SET status = 'available' WHERE status IS NULL")
        print("Updated existing artworks with 'available' status")
        
        conn.commit()
        print("Database update completed successfully!")
        
    except Exception as e:
        print(f"Error updating database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    update_database() 