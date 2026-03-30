
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from pydantic import BaseModel


class StudentCreate(BaseModel):
    name: str = Field(example="Rahul Sharma")
    email: EmailStr = Field(example="example@example.com")
    age: int = Field(example=1, ge=0)
    course: str = Field(example="Computer Science")
   

class Student(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int
    course: str
    enrollment_date: datetime

class studentListResponse(BaseModel):
    students: list[Student]
    total: int  

class UserLogin(BaseModel):
    email: str
    password: str

class Config:
    from_attributes = True
