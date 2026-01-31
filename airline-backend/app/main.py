from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.core.settings import settings

# Imports from your __init__.py setup
from app.routers import auth_router, flight_router, booking_router
from app.models import User, Flight, Booking
# This will create all tables in your BRAND NEW database automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkyLink Airlines")

# --- THE DEFINITIVE CORS FIX ---
# Note: You MUST use explicit URLs when allow_credentials=True
origins = [
    "https://airline-frontend2.onrender.com", # Your Production URL
    "http://localhost:5173",                  # Local Development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTER REGISTRATION ---
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(flight_router, prefix="/flights", tags=["Flights"])
app.include_router(booking_router, prefix="/bookings", tags=["Bookings"])

@app.get("/")
def root():
    return {"status": "SkyLink API is online and Database is fresh"}
