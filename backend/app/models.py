
# models.py
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Student(Base):
     __tablename__ = "students"
     id = Column(Integer, primary_key=True, index=True)
     name = Column(String, nullable=False)
     email = Column(String, unique=True, index=True)
     age = Column(Integer)
     course = Column(String)
     enrollment_date = Column(DateTime, default=datetime.utcnow)



