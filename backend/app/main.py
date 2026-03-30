from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import engine
from backend.app.models import Base
from backend.app.routers import students
from backend.app.routers import auth

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(students.router)
app.include_router(auth.router, tags=["Auth"])
