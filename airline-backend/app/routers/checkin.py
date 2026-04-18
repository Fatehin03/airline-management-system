from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

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


def parse_booking_query(query: str):
    normalized = query.strip()

    if not normalized:
        return None

    compact = normalized.replace(" ", "").replace("-", "")

    if compact.upper().startswith("BK") and compact[2:].isdigit():
        return int(compact[2:])

    if compact.isdigit():
        return int(compact)

    return None


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
    booking_id = parse_booking_query(query)

    if booking_id is not None:
        booking = (
            db.query(Booking)
            .options(joinedload(Booking.flight), joinedload(Booking.user))
            .filter(Booking.id == booking_id)
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


@checkin_router.get("/search/multi")
def search_passenger_multi(query: str, limit: int = 5, db: Session = Depends(get_db)):
    query = query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    if len(query) < 2:
        raise HTTPException(status_code=400, detail="Search query must be at least 2 characters")

    limit = max(1, min(limit, 20))
    booking_id = parse_booking_query(query)

    base_query = (
        db.query(Booking)
        .options(joinedload(Booking.flight), joinedload(Booking.user))
        .join(User, Booking.user_id == User.id)
    )

    if booking_id is not None:
        bookings = (
            base_query.filter(
                or_(
                    Booking.id == booking_id,
                    User.email.ilike(f"%{query}%"),
                    User.full_name.ilike(f"%{query}%"),
                )
            )
            .order_by(Booking.id.desc())
            .limit(limit)
            .all()
        )
    else:
        bookings = (
            base_query.filter(
                or_(
                    User.email.ilike(f"%{query}%"),
                    User.full_name.ilike(f"%{query}%"),
                )
            )
            .order_by(Booking.id.desc())
            .limit(limit)
            .all()
        )

    return {
        "query": query,
        "count": len(bookings),
        "results": [serialize_checkin_booking(booking) for booking in bookings],
    }


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
