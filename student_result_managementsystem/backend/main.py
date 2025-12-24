from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn

# Database Setup
DATABASE_URL = "sqlite:///./student_results.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ============================================
# DATABASE MODELS (SQLAlchemy)
# ============================================

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    roll_no = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    
    results = relationship("Result", back_populates="student", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    credits = Column(Integer)
    
    results = relationship("Result", back_populates="course", cascade="all, delete-orphan")

class Result(Base):
    __tablename__ = "results"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    marks = Column(Float)
    grade = Column(String)
    gpa = Column(Float)
    
    student = relationship("Student", back_populates="results")
    course = relationship("Course", back_populates="results")

Base.metadata.create_all(bind=engine)

# ============================================
# PYDANTIC SCHEMAS
# ============================================

class StudentBase(BaseModel):
    roll_no: str
    name: str
    email: EmailStr
    phone: str

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    code: str
    name: str
    credits: int

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    class Config:
        from_attributes = True

class ResultBase(BaseModel):
    student_id: int
    course_id: int
    marks: float

class ResultCreate(ResultBase):
    pass

class ResultUpdate(BaseModel):
    marks: float

class ResultResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    marks: float
    grade: str
    gpa: float
    class Config:
        from_attributes = True

class StudentResultsResponse(BaseModel):
    student: StudentResponse
    results: List[ResultResponse]
    cgpa: float

# ============================================
# GRADE CALCULATION
# ============================================

def calculate_grade(marks: float) -> tuple:
    if marks >= 90:
        return ("A+", 4.0)
    elif marks >= 85:
        return ("A", 4.0)
    elif marks >= 80:
        return ("A-", 3.7)
    elif marks >= 75:
        return ("B+", 3.5)
    elif marks >= 70:
        return ("B", 3.0)
    elif marks >= 65:
        return ("B-", 2.7)
    elif marks >= 60:
        return ("C+", 2.5)
    elif marks >= 55:
        return ("C", 2.0)
    elif marks >= 50:
        return ("C-", 1.7)
    else:
        return ("F", 0.0)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================
# FASTAPI APP
# ============================================

app = FastAPI(
    title="Student Result Management System",
    description="API for managing students, courses, and results",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# STUDENT ENDPOINTS
# ============================================

@app.post("/api/students", response_model=StudentResponse, status_code=201)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.roll_no == student.roll_no).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Roll number already registered")
    
    db_student = db.query(Student).filter(Student.email == student.email).first()
    if db_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_student = Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

@app.get("/api/students", response_model=List[StudentResponse])
def get_all_students(db: Session = Depends(get_db)):
    return db.query(Student).all()

@app.get("/api/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/api/students/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, student: StudentUpdate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

@app.delete("/api/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}

# ============================================
# COURSE ENDPOINTS
# ============================================

@app.post("/api/courses", response_model=CourseResponse, status_code=201)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    db_course = db.query(Course).filter(Course.code == course.code).first()
    if db_course:
        raise HTTPException(status_code=400, detail="Course code already exists")
    
    new_course = Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@app.get("/api/courses", response_model=List[CourseResponse])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@app.get("/api/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.put("/api/courses/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, course: CourseUpdate, db: Session = Depends(get_db)):
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    for key, value in course.dict().items():
        setattr(db_course, key, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted successfully"}

# ============================================
# RESULT ENDPOINTS
# ============================================

@app.post("/api/results", response_model=ResultResponse, status_code=201)
def create_result(result: ResultCreate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == result.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    course = db.query(Course).filter(Course.id == result.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing = db.query(Result).filter(
        Result.student_id == result.student_id,
        Result.course_id == result.course_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Result already exists")
    
    grade, gpa = calculate_grade(result.marks)
    
    new_result = Result(
        student_id=result.student_id,
        course_id=result.course_id,
        marks=result.marks,
        grade=grade,
        gpa=gpa
    )
    
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    return new_result

@app.get("/api/results", response_model=List[ResultResponse])
def get_all_results(db: Session = Depends(get_db)):
    return db.query(Result).all()

@app.get("/api/results/{result_id}", response_model=ResultResponse)
def get_result(result_id: int, db: Session = Depends(get_db)):
    result = db.query(Result).filter(Result.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return result

@app.put("/api/results/{result_id}", response_model=ResultResponse)
def update_result(result_id: int, result_update: ResultUpdate, db: Session = Depends(get_db)):
    db_result = db.query(Result).filter(Result.id == result_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    db_result.marks = result_update.marks
    grade, gpa = calculate_grade(result_update.marks)
    db_result.grade = grade
    db_result.gpa = gpa
    
    db.commit()
    db.refresh(db_result)
    return db_result

@app.delete("/api/results/{result_id}")
def delete_result(result_id: int, db: Session = Depends(get_db)):
    db_result = db.query(Result).filter(Result.id == result_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    db.delete(db_result)
    db.commit()
    return {"message": "Result deleted successfully"}

# ============================================
# ANALYTICS
# ============================================

@app.get("/api/students/{student_id}/results", response_model=StudentResultsResponse)
def get_student_results(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    results = db.query(Result).filter(Result.student_id == student_id).all()
    
    cgpa = 0.0
    if results:
        total_gpa = sum(r.gpa for r in results)
        cgpa = total_gpa / len(results)
    
    return {
        "student": student,
        "results": results,
        "cgpa": round(cgpa, 2)
    }

@app.get("/api/analytics/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_students = db.query(Student).count()
    total_courses = db.query(Course).count()
    
    all_results = db.query(Result).all()
    avg_gpa = 0.0
    if all_results:
        total_gpa = sum(r.gpa for r in all_results)
        avg_gpa = total_gpa / len(all_results)
    
    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "average_gpa": round(avg_gpa, 2),
        "total_results": len(all_results)
    }

@app.get("/")
def root():
    return {
        "message": "Student Result Management System API",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)