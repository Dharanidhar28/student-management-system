
# main.py
from fastapi import FastAPI
from app.routers import students
from app.database import engine
from app.models import Base
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware

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