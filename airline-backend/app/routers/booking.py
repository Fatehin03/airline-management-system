from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.booking import Booking
from app.models.flight import Flight

router = APIRouter()


@router.post("/")
def create_booking(booking_data: dict, db: Session = Depends(get_db)):
    flight_id = booking_data.get("flight_id")
    user_id = booking_data.get("user_id")
    seat_number = booking_data.get("seat_number")

    if not flight_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="flight_id is required",
        )

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id is required",
        )

    flight = db.query(Flight).filter(Flight.id == flight_id).first()

    if not flight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flight not found",
        )

    if flight.available_seats <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No seats available for this flight",
        )

    booking = Booking(
        user_id=user_id,
        flight_id=flight.id,
        status="Confirmed",
        seat_number=seat_number,
    )

    flight.available_seats -= 1

    db.add(booking)
    db.commit()
    db.refresh(booking)
    db.refresh(flight)

    return {
        "message": "Booking successful",
        "booking": {
            "id": booking.id,
            "user_id": booking.user_id,
            "flight_id": booking.flight_id,
            "status": booking.status,
            "seat_number": booking.seat_number,
            "booking_date": booking.booking_date,
        },
        "flight": {
            "id": flight.id,
            "flight_number": flight.flight_number,
            "available_seats": flight.available_seats,
        },
    }


@router.get("/my-bookings")
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()

    return [
        {
            "id": booking.id,
            "user_id": booking.user_id,
            "flight_id": booking.flight_id,
            "status": booking.status,
            "seat_number": booking.seat_number,
            "booking_date": booking.booking_date,
        }
        for booking in bookings
    ]
