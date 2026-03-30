from pathlib import Path
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = Path(__file__).resolve().parent.parent
SQLITE_DATABASE_URL = f"sqlite:///{(BASE_DIR / 'students.db').as_posix()}"
DATABASE_URL = os.getenv("DATABASE_URL", SQLITE_DATABASE_URL)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine_kwargs = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(
autocommit=False,
autoflush=False,
bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
       yield db
    finally:
        db.close()
