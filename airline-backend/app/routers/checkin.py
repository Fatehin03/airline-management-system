from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

checkin_router = APIRouter()

mock_passengers = [
    {
        "booking_id": 1,
        "booking": "ABC123",
        "passenger": "John Doe",
        "flight": "SK-101",
        "seat": "12A",
        "status": "Ready for Check-in",
        "baggage": 1,
        "gate": "B12",
    },
    {
        "booking_id": 2,
        "booking": "XYZ789",
        "passenger": "Jane Smith",
        "flight": "SK-205",
        "seat": "8C",
        "status": "Ready for Check-in",
        "baggage": 1,
        "gate": "C08",
    },
]


class CheckinCompleteRequest(BaseModel):
    booking_id: int


class ChangeSeatRequest(BaseModel):
    booking_id: int
    seat: str


class AddBaggageRequest(BaseModel):
    booking_id: int
    bags: int


@checkin_router.get("/search")
def search_passenger(query: str):
    query = query.strip().upper()

    for passenger in mock_passengers:
        if passenger["booking"] == query:
            return passenger

    raise HTTPException(status_code=404, detail="Passenger not found")


@checkin_router.post("/complete")
def complete_checkin(payload: CheckinCompleteRequest):
    for passenger in mock_passengers:
        if passenger["booking_id"] == payload.booking_id:
            passenger["status"] = "Checked In"
            return {"message": "Check-in completed successfully"}

    raise HTTPException(status_code=404, detail="Booking not found")


@checkin_router.get("/boarding-pass/{booking_id}")
def get_boarding_pass(booking_id: int):
    for passenger in mock_passengers:
        if passenger["booking_id"] == booking_id:
            return {
                "message": "Boarding pass generated",
                "boarding_pass": {
                    "passenger": passenger["passenger"],
                    "flight": passenger["flight"],
                    "seat": passenger["seat"],
                    "gate": passenger["gate"],
                    "status": passenger["status"],
                },
            }

    raise HTTPException(status_code=404, detail="Booking not found")


@checkin_router.put("/change-seat")
def change_seat(payload: ChangeSeatRequest):
    for passenger in mock_passengers:
        if passenger["booking_id"] == payload.booking_id:
            passenger["seat"] = payload.seat
            return {"message": "Seat changed successfully", "seat": payload.seat}

    raise HTTPException(status_code=404, detail="Booking not found")


@checkin_router.put("/add-baggage")
def add_baggage(payload: AddBaggageRequest):
    for passenger in mock_passengers:
        if passenger["booking_id"] == payload.booking_id:
            passenger["baggage"] += payload.bags
            return {
                "message": "Baggage added successfully",
                "baggage": passenger["baggage"],
            }

    raise HTTPException(status_code=404, detail="Booking not found")


@checkin_router.get("/manifest/{flight_number}")
def get_manifest(flight_number: str):
    passengers = [p for p in mock_passengers if p["flight"] == flight_number]

    return {
        "flight": flight_number,
        "count": len(passengers),
        "passengers": passengers,
    }
