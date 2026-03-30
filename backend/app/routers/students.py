from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import backend.app.crud as crud 
import backend.app.schemas as schemas
from backend.app.database import get_db
from backend.app.dependencies import oauth2_scheme

router = APIRouter(prefix="/students", tags=["Students"])



@router.post("/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate,db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return crud.create_student(student, db)


@router.get("/", response_model=schemas.studentListResponse)
def get_students(skip: int = Query(0, ge = 0),
                          limit: int = Query(10, le = 100),
                          course: str | None = None ,
                          age : int | None = Query(None, ge = 0),
                          sort_by: str | None = Query(None, regex = "^(name|age|course)$"),
                          db: Session = Depends(get_db)):
     return crud.get_students(skip, limit, course, age, sort_by, db)

@router.get("/{student_id}", response_model=schemas.Student)
def get_student(student_id: int, db: Session = Depends(get_db)):
     return crud.get_student(student_id, db)

@router.put("/{student_id}", response_model=schemas.Student)
def update_student(student_id: int, student: schemas.StudentCreate, db: Session = Depends(get_db)):
     return crud.update_student(student_id, student, db)

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
     return crud.delete_student(student_id, db)