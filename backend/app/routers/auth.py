from fastapi import APIRouter, Depends, HTTPException
from app.schemas import UserLogin
from app.auth import create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = UserLogin(email=form_data.username, password=form_data.password)

    if user.email != "admin@example.com" or user.password != "1234":
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {"access_token": token, "token_type": "bearer"}