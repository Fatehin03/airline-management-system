from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User # Ensure you have a User model
from app.utils.security import verify_password, create_access_token # You'll need these utils

router = APIRouter()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Find the user
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # 2. Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # 3. Create a REAL JWT token
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}
