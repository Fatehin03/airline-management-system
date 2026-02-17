"""
migrate_add_roles.py
────────────────────
Adds the `employee_id` column to your existing users table.
The `role` column already exists so we skip it.

Run once from your airline-backend/ folder:
    python migrate_add_roles.py
"""
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database import engine

def column_exists(conn, table, column):
    result = conn.execute(text(
        "SELECT COUNT(*) FROM information_schema.columns "
        "WHERE table_name = :t AND column_name = :c"
    ), {"t": table, "c": column})
    return result.scalar() > 0

def run_migration():
    print("Starting migration...")
    with engine.connect() as conn:

        # role already exists — just confirm
        if column_exists(conn, "users", "role"):
            print("  Column `role` already exists — OK")
        else:
            conn.execute(text(
                "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'passenger'"
            ))
            print("  Added column: role")

        # employee_id is new
        if not column_exists(conn, "users", "employee_id"):
            conn.execute(text(
                "ALTER TABLE users ADD COLUMN employee_id VARCHAR(50) UNIQUE"
            ))
            print("  Added column: employee_id (nullable, unique)")
        else:
            print("  Column `employee_id` already exists — skipping")

        conn.commit()
    print("Migration complete!")

if __name__ == "__main__":
    run_migration()
