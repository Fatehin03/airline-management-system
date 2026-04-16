from app.database import engine, Base
from app.models.user import User

def migrate():
    """Add phone and nationality columns to users table"""
    with engine.begin() as connection:
        # Add columns if they don't exist
        connection.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS phone VARCHAR
        """)
        connection.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS nationality VARCHAR
        """)
    print("Migration completed: Added phone and nationality columns")

if __name__ == "__main__":
    migrate()
