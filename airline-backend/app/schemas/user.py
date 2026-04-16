from pydantic import BaseModel, EmailStr
from typing import Optional

class UpdateProfileSchema(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    nationality: Optional[str] = None

    class Config:
        from_attributes = True
