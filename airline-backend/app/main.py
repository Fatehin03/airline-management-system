import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from app.database import engine, Base
from app.core.settings import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.routers import auth_router, flight_router, booking_router, checkin_router
from app.models import User, Flight, Booking


def ensure_users_profile_columns():
    """
    Backfill missing users.phone and users.nationality columns for older databases.
    This keeps login/register working even when the table existed before these
    columns were introduced.
    """
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    if "users" not in tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    statements = []

    if "phone" not in existing_columns:
        statements.append("ALTER TABLE users ADD COLUMN phone VARCHAR")

    if "nationality" not in existing_columns:
        statements.append("ALTER TABLE users ADD COLUMN nationality VARCHAR")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


try:
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    ensure_users_profile_columns()
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(title="SkyLink Airlines")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(flight_router, prefix="/flights", tags=["Flights"])
app.include_router(booking_router, prefix="/bookings", tags=["Bookings"])
app.include_router(checkin_router, prefix="/checkin", tags=["Check-In"])

@app.get("/")
def root():
    return {"status": "SkyLink API is online and Database is fresh"}
