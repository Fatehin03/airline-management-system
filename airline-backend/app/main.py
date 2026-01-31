from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.core.settings import settings

# Corrected Imports
from app.routers import auth_router, flight_router, booking_router

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkyLink Airlines")

# --- THE CRITICAL FIX ---
# You CANNOT use ["*"] if allow_credentials=True. 
# You must list the specific frontend URL.
origins = [
    "https://airline-frontend2.onrender.com", # Your Production Frontend
    "http://localhost:5173",                  # Your Local Frontend
    "http://localhost:3000"                   # Alternate Local Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # Use the specific list, NOT ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------

# Include Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(flight_router, prefix="/flights", tags=["Flights"])
app.include_router(booking_router, prefix="/bookings", tags=["Bookings"])

@app.get("/")
def root():
    return {"status": "SkyLink API is online"}
