from sqlalchemy import Column, Integer, String, DateTime, Float
from app.database import Base

class Flight(Base):
    __tablename__ = "flights"
    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, unique=True, index=True) # e.g., SL123
    origin = Column(String, index=True)      # Airport Code (JFK)
    destination = Column(String, index=True) # Airport Code (LHR)
    departure_time = Column(DateTime)
    arrival_time = Column(DateTime)
    price = Column(Float)
    total_seats = Column(Integer)
    available_seats = Column(Integer)
    status = Column(String, default="Scheduled") # Scheduled, Delayed, Cancelled
