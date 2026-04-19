from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_admin
from app.database import get_db
from app.models.booking import Booking
from app.models.flight import Flight
from app.models.user import User

admin_router = APIRouter()


class FlightUpsertSchema(BaseModel):
    flight_number: str = Field(min_length=2, max_length=30)
    origin: str = Field(min_length=2, max_length=100)
    destination: str = Field(min_length=2, max_length=100)
    departure_time: datetime
    arrival_time: datetime
    price: float = Field(gt=0)
    total_seats: int = Field(gt=0)
    status: str = "Scheduled"


class UpdateUserStatusSchema(BaseModel):
    is_active: bool


def serialize_flight(flight: Flight):
    return {
        "id": flight.id,
        "flight_number": flight.flight_number,
        "origin": flight.origin,
        "destination": flight.destination,
        "departure_time": flight.departure_time,
        "arrival_time": flight.arrival_time,
        "price": flight.price,
        "total_seats": flight.total_seats,
        "available_seats": flight.available_seats,
        "status": flight.status,
    }


@admin_router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    total_users = db.query(User).count()
    total_staff = db.query(User).filter(User.role == "staff").count()
    total_passengers = db.query(User).filter(User.role == "passenger").count()
    total_flights = db.query(Flight).count()
    total_bookings = db.query(Booking).count()
    checked_in_count = db.query(Booking).filter(Booking.status == "Checked In").count()

    return {
        "totals": {
            "users": total_users,
            "staff": total_staff,
            "passengers": total_passengers,
            "flights": total_flights,
            "bookings": total_bookings,
            "checked_in": checked_in_count,
        }
    }


@admin_router.get("/flights")
def admin_get_flights(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    query = db.query(Flight)
    if status:
        query = query.filter(Flight.status == status)
    flights = query.order_by(Flight.departure_time.asc()).all()
    return [serialize_flight(flight) for flight in flights]


@admin_router.post("/flights")
def admin_create_flight(
    payload: FlightUpsertSchema,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    if payload.arrival_time <= payload.departure_time:
        raise HTTPException(status_code=400, detail="Arrival must be after departure")

    exists = db.query(Flight).filter(Flight.flight_number == payload.flight_number).first()
    if exists:
        raise HTTPException(status_code=400, detail="Flight number already exists")

    flight = Flight(
        **payload.model_dump(),
        available_seats=payload.total_seats,
    )
    db.add(flight)
    db.commit()
    db.refresh(flight)
    return {"message": "Flight created successfully", "flight": serialize_flight(flight)}


@admin_router.put("/flights/{flight_id}")
def admin_update_flight(
    flight_id: int,
    payload: FlightUpsertSchema,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")

    if payload.arrival_time <= payload.departure_time:
        raise HTTPException(status_code=400, detail="Arrival must be after departure")

    duplicate = (
        db.query(Flight)
        .filter(Flight.flight_number == payload.flight_number, Flight.id != flight_id)
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=400, detail="Flight number already exists")

    booked_seats = max(flight.total_seats - flight.available_seats, 0)
    if payload.total_seats < booked_seats:
        raise HTTPException(
            status_code=400,
            detail=f"total_seats cannot be less than already booked seats ({booked_seats})",
        )

    flight.flight_number = payload.flight_number
    flight.origin = payload.origin
    flight.destination = payload.destination
    flight.departure_time = payload.departure_time
    flight.arrival_time = payload.arrival_time
    flight.price = payload.price
    flight.status = payload.status
    flight.total_seats = payload.total_seats
    flight.available_seats = payload.total_seats - booked_seats

    db.commit()
    db.refresh(flight)
    return {"message": "Flight updated successfully", "flight": serialize_flight(flight)}


@admin_router.delete("/flights/{flight_id}")
def admin_delete_flight(
    flight_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")

    booking_count = db.query(Booking).filter(Booking.flight_id == flight_id).count()
    if booking_count > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete flight with bookings. Set status to Cancelled instead.",
        )

    db.delete(flight)
    db.commit()
    return {"message": "Flight deleted successfully"}


@admin_router.get("/users")
def admin_get_users(
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.order_by(User.id.desc()).all()

    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "employee_id": user.employee_id,
            "is_active": user.is_active,
            "phone": user.phone,
            "nationality": user.nationality,
        }
        for user in users
    ]


@admin_router.put("/users/{user_id}/status")
def admin_update_user_status(
    user_id: int,
    payload: UpdateUserStatusSchema,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_admin.id and not payload.is_active:
        raise HTTPException(status_code=400, detail="Admin cannot deactivate own account")

    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return {"message": "User status updated", "user_id": user.id, "is_active": user.is_active}


@admin_router.get("/bookings")
def admin_get_bookings(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.flight), joinedload(Booking.user))
        .order_by(Booking.booking_date.desc())
        .all()
    )

    return [
        {
            "id": booking.id,
            "status": booking.status,
            "seat_number": booking.seat_number,
            "booking_date": booking.booking_date,
            "user": {
                "id": booking.user.id if booking.user else None,
                "email": booking.user.email if booking.user else None,
                "full_name": booking.user.full_name if booking.user else None,
            },
            "flight": {
                "id": booking.flight.id if booking.flight else None,
                "flight_number": booking.flight.flight_number if booking.flight else None,
                "origin": booking.flight.origin if booking.flight else None,
                "destination": booking.flight.destination if booking.flight else None,
            },
        }
        for booking in bookings
    ]
