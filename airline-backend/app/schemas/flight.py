from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FlightBase(BaseModel):
    flight_number: str
    origin: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    total_seats: int

class FlightCreate(FlightBase):
    pass

class FlightOut(FlightBase):
    id: int
    available_seats: int
    status: str

    class Config:
        from_attributes = True
