# routers/student.py
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from database import get_session
from security import verify_token
from models.personal_info import PersonalInfo
from models.mentor import Mentor
from models.student import Student
from models.achievement import Achievement
from models.mark import Mark
from models.counseling import Counseling 
from schema.profile import CombinedUpdateRequest, StudentProfileResponse
from utils.image_upload import upload_image

router = APIRouter(prefix="/api/v1/student", tags=["student"])

security = HTTPBearer()

def get_current_student(
    creds: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
):
    payload = verify_token(creds.credentials)
    student_id = payload.get("sub")
    if not student_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    student = session.get(PersonalInfo, student_id)
    if not student:
        raise HTTPException(status_code=401, detail="Student not found")
    
    return student

@router.get("/me", response_model=StudentProfileResponse)
def get_my_profile(current_student: PersonalInfo = Depends(get_current_student)):
    student = current_student.student
    if not student:
        raise HTTPException(detail="No related Student found")
    
    return StudentProfileResponse(
        personal_info=current_student,
        achievements=student.achievements,
        marks=student.marks,
        counseling=student.counseling
    )

@router.get("/", response_model=StudentProfileResponse)
def get_student(
    uuid: str = Query(..., description="UUID of the student"),
    session: Session = Depends(get_session)
):
    personal_info = session.exec(
        select(PersonalInfo).where(PersonalInfo.id == uuid)
    ).first()

    if not personal_info:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student = personal_info.student
    if not student:
        raise HTTPException(status_code=404, detail="Student relation missing")
    return StudentProfileResponse(
        personal_info=personal_info,
        achievements=student.achievements,
        marks=student.marks,
        counseling=student.counseling
    )

@router.post("/personal_info")
async def update_personal_info(
    update_data: CombinedUpdateRequest,
    session: Session = Depends(get_session),
    current_student: Student = Depends(get_current_student),
):
    # print(update_data)
    if update_data.personal_info:
        pi = current_student
        if pi:
            for field, value in update_data.personal_info.dict(exclude_unset=True).items():
                setattr(pi, field, value)
        else:
            new_pi = PersonalInfo(**update_data.personal_info.dict(), student_id=current_student.id)
            session.add(new_pi)
    student = current_student.student
    # print(student)
    # Update achievements (single object)
    if update_data.achievements:
        ach = student.achievements
        if ach:
            for field, value in update_data.achievements.dict(exclude_unset=True).items():
                setattr(ach, field, value)
        else:
            new_ach = Achievement(**update_data.achievements.dict(), student_id=student.id)
            session.add(new_ach)

    # Replace marks (delete existing + add new)
    if update_data.marks is not None:
        # Delete existing
        for mark in student.marks:
            session.delete(mark)
        # Add new
        for mark_data in update_data.marks:
            new_mark = Mark(**mark_data.dict(), student_id=student.id)
            session.add(new_mark)

    # Replace counseling records (delete existing + add new)
    if update_data.counseling is not None:
        for c in student.counseling:
            session.delete(c)
        for c_data in update_data.counseling:
            new_c = Counseling(**c_data.dict(), student_id=student.id)
            session.add(new_c)

    session.commit()
    return {"message": "Student information updated successfully"}

@router.post("/upload_photo")
async def upload_photo(
    photo: UploadFile = File(...),
    current_student: Student = Depends(get_current_student),
    session: Session = Depends(get_session)
):
    photo_url = await upload_image(photo, current_student.id)
    current_student.photo = photo_url
    session.add(current_student)
    session.commit()
    return {"photo_url": photo_url}
