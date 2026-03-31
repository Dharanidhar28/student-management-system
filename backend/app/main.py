
# main.py
from fastapi import FastAPI
from backend.app.routers import students
from backend.app.database import engine
from backend.app.models import Base
from backend.app.routers import auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse



app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

@app.get("/")
def read_root():
    return FileResponse("/frontend/login.html")


import os

port = int(os.environ.get("PORT", 10000))

Base.metadata.create_all(bind=engine)


app.include_router(students.router)
app.include_router(auth.router, tags=["Auth"])