from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.booking import Booking
from app.models.flight import Flight

router = APIRouter()


def serialize_booking(booking: Booking):
    flight = booking.flight

    return {
        "id": booking.id,
        "user_id": booking.user_id,
        "flight_id": booking.flight_id,
        "status": booking.status,
        "seat_number": booking.seat_number,
        "booking_date": booking.booking_date,
        "flight": {
            "id": flight.id if flight else None,
            "flight_number": flight.flight_number if flight else None,
            "origin": flight.origin if flight else None,
            "destination": flight.destination if flight else None,
            "departure_time": flight.departure_time if flight else None,
            "arrival_time": flight.arrival_time if flight else None,
            "price": flight.price if flight else None,
            "status": flight.status if flight else None,
        },
    }


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

    if flight.status == "Cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This flight is cancelled and cannot be booked",
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
        seat_number=seat_number or f"A{flight.available_seats}",
    )

    flight.available_seats -= 1

    db.add(booking)
    db.commit()
    db.refresh(booking)

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.flight))
        .filter(Booking.id == booking.id)
        .first()
    )

    return {
        "message": "Booking successful",
        "booking": serialize_booking(booking),
        "flight": {
            "id": flight.id,
            "flight_number": flight.flight_number,
            "available_seats": flight.available_seats,
        },
    }


@router.get("/my-bookings")
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.flight))
        .filter(Booking.user_id == user_id)
        .order_by(Booking.booking_date.desc())
        .all()
    )

    return [serialize_booking(booking) for booking in bookings]


@router.put("/{booking_id}/cancel")
def cancel_booking(booking_id: int, user_id: int, db: Session = Depends(get_db)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.flight))
        .filter(Booking.id == booking_id, Booking.user_id == user_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.status == "Cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled",
        )

    booking.status = "Cancelled"

    if booking.flight:
        booking.flight.available_seats += 1

    db.commit()
    db.refresh(booking)

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.flight))
        .filter(Booking.id == booking.id)
        .first()
    )

    return {
        "message": "Booking cancelled successfully",
        "booking": serialize_booking(booking),
    }
