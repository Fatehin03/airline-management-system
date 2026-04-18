from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.booking import Booking
from app.models.flight import Flight
from app.models.user import User

checkin_router = APIRouter()


class CheckinCompleteRequest(BaseModel):
    booking_id: int


class ChangeSeatRequest(BaseModel):
    booking_id: int
    seat: str


class AddBaggageRequest(BaseModel):
    booking_id: int
    bags: int


def serialize_checkin_booking(booking: Booking):
    flight = booking.flight
    user = booking.user

    return {
        "booking_id": booking.id,
        "booking": f"BK{booking.id:06d}",
        "passenger": user.full_name if user and user.full_name else user.email if user else "Unknown Passenger",
        "flight": flight.flight_number if flight else None,
        "seat": booking.seat_number or "Auto Assigned",
        "status": booking.status,
        "baggage": 0,
        "gate": "TBD",
    }


@checkin_router.get("/search")
def search_passenger(query: str, db: Session = Depends(get_db)):
    query = query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    booking = None

    if query.upper().startswith("BK") and query[2:].isdigit():
        booking_id = int(query[2:])
        booking = (
            db.query(Booking)
            .options(joinedload(Booking.flight), joinedload(Booking.user))
            .filter(Booking.id == booking_id)
            .first()
        )
    elif query.isdigit():
        booking = (
            db.query(Booking)
            .options(joinedload(Booking.flight), joinedload(Booking.user))
            .filter(Booking.id == int(query))
            .first()
        )
    else:
        booking = (
            db.query(Booking)
            .options(joinedload(Booking.flight), joinedload(Booking.user))
            .join(User, Booking.user_id == User.id)
            .filter(User.email.ilike(f"%{query}%"))
            .first()
        )

    if not booking:
        raise HTTPException(status_code=404, detail="Passenger not found")

    return serialize_checkin_booking(booking)


@checkin_router.post("/complete")
def complete_checkin(payload: CheckinCompleteRequest, db: Session = Depends(get_db)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.flight), joinedload(Booking.user))
        .filter(Booking.id == payload.booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "Checked In"
    db.commit()
    db.refresh(booking)

    return {
        "message": "Check-in completed successfully",
        "booking": serialize_checkin_booking(booking),
    }


@checkin_router.get("/boarding-pass/{booking_id}")
def get_boarding_pass(booking_id: int, db: Session = Depends(get_db)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.flight), joinedload(Booking.user))
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    passenger = serialize_checkin_booking(booking)

    return {
        "message": "Boarding pass generated",
        "boarding_pass": {
            "passenger": passenger["passenger"],
            "flight": passenger["flight"],
            "seat": passenger["seat"],
            "gate": passenger["gate"],
            "status": passenger["status"],
            "booking": passenger["booking"],
        },
    }


@checkin_router.put("/change-seat")
def change_seat(payload: ChangeSeatRequest, db: Session = Depends(get_db)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.flight), joinedload(Booking.user))
        .filter(Booking.id == payload.booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.seat_number = payload.seat
    db.commit()
    db.refresh(booking)

    return {
        "message": "Seat changed successfully",
        "seat": booking.seat_number,
        "booking": serialize_checkin_booking(booking),
    }


@checkin_router.put("/add-baggage")
def add_baggage(payload: AddBaggageRequest, db: Session = Depends(get_db)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.flight), joinedload(Booking.user))
        .filter(Booking.id == payload.booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {
        "message": "Baggage added successfully",
        "baggage": payload.bags,
        "booking": serialize_checkin_booking(booking),
    }


@checkin_router.get("/manifest/{flight_number}")
def get_manifest(flight_number: str, db: Session = Depends(get_db)):
    flight = db.query(Flight).filter(Flight.flight_number == flight_number).first()

    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")

    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.flight), joinedload(Booking.user))
        .filter(Booking.flight_id == flight.id)
        .all()
    )

    passengers = [serialize_checkin_booking(booking) for booking in bookings]

    return {
        "flight": flight.flight_number,
        "count": len(passengers),
        "passengers": passengers,
    }
