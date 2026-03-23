from unittest import skip

from fastapi import FastAPI,Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
import app.models as models
import app.schemas as schemas



def create_student(student: schemas.StudentCreate,db: Session = Depends(get_db)):
    existing_student = db.query(models.Student).filter(models.Student.email == student.email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email already exists")
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def get_students(skip: int = Query(0, ge = 0),
                       limit: int = Query(10, le = 100),
                       course: str | None = None ,
                       age : int | None = Query(None, ge = 0),
                       sort_by: str | None = Query(None, regex="^(name|age|course)$"),
                       db: Session = Depends(get_db)):
     query = db.query(models.Student)
     if course:
        query = query.filter(models.Student.course == course)
     if age is not None:
        query = query.filter(models.Student.age == age)
        if sort_by:
            if sort_by == "name":
                query = query.order_by(models.Student.name)
            elif sort_by == "age":
                query = query.order_by(models.Student.age)
            elif sort_by == "course":
                query = query.order_by(models.Student.course)
     return query.offset(skip).limit(limit).all()

def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

def update_student(student_id: int, student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.model_dump().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"detail": "Student deleted successfully"}
