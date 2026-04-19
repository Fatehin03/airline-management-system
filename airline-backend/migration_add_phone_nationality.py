from sqlalchemy import inspect, text

from app.database import engine

def migrate():
    """Add phone and nationality columns to users table"""
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        print("users table does not exist yet. Run app startup first.")
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    statements = []

    if "phone" not in existing_columns:
        statements.append("ALTER TABLE users ADD COLUMN phone VARCHAR")

    if "nationality" not in existing_columns:
        statements.append("ALTER TABLE users ADD COLUMN nationality VARCHAR")

    if not statements:
        print("Migration skipped: users.phone and users.nationality already exist")
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))

    print("Migration completed: added missing users profile columns")

if __name__ == "__main__":
    migrate()
