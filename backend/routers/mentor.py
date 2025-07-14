from fastapi import APIRouter, status, Query, Depends
from fastapi.exceptions import HTTPException
from schema.mentor import MentorLoginRequest, MentorLoginResponse
from schema.profile import StudentProfileResponse
from database import SessionDep
from models import Mentor, PersonalInfo
from sqlmodel import select
from security import verify_password, create_token, MentorDep
from typing import List, Optional

router = APIRouter(prefix="/api/v1/mentor", tags=["mentor"])


@router.post("/login", response_model=MentorLoginResponse)
def login_mentor(request: MentorLoginRequest, session: SessionDep):
    mentor = session.exec(select(Mentor).where(Mentor.email == request.email)).first()
    if not mentor or not verify_password(request.password, mentor.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return MentorLoginResponse(access_token=create_token(str(mentor.id)), token_type="Bearer")


@router.get("/students", response_model=List[StudentProfileResponse])
def get_students(
    mentor: MentorDep,
    name: Optional[str] = Query(None, description="Filter by name, enrollment_no or email"),
    semester: Optional[str] = Query(None, description="Filter by semester (e.g., sem1, sem2, ...)"),
    is_ban: Optional[bool] = Query(None, description="Filter by ban status: true=banned, false=unbanned")
):
    filtered_students = mentor.students

    if name:
        name_lower = name.lower()
        filtered_students = [
            s for s in filtered_students
            if s.personal_info and (
                name_lower in (s.personal_info.name or "").lower()
                or name_lower in (s.personal_info.enrollment_no or "").lower()
                or name_lower in (s.personal_info.atharva_email or "").lower()
            )
        ]

    if semester:
        filtered_students = [
            s for s in filtered_students
            if any(m.semester == semester for m in s.marks)
        ]

    if is_ban is not None:
        filtered_students = [
            s for s in filtered_students
            if s.personal_info and s.personal_info.is_ban == is_ban
        ]

    return [
        StudentProfileResponse(
            personal_info=s.personal_info,
            achievements=s.achievements,
            marks=s.marks,
            counseling=s.counseling
        )
        for s in filtered_students
    ]


@router.post("/ban")
def ban_student(
    session: SessionDep,
    mentor: MentorDep,
    email: str = Query(..., description="Student's atharva_email to ban/unban"),
    is_ban: bool = Query(..., description="True to ban, False to unban")
):
    student_info = session.exec(select(PersonalInfo).where(PersonalInfo.atharva_email == email)).first()

    if not student_info:
        raise HTTPException(status_code=404, detail="Student not found")

    student_info.is_ban = is_ban
    session.add(student_info)
    session.commit()

    return {"message": f"Student {email} has been {'banned' if is_ban else 'unbanned'} successfully."}
