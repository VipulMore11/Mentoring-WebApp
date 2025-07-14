from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import uuid

if TYPE_CHECKING:
    from models import Student

class PersonalInfo(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    atharva_email: str  # required, from Google OAuth

    enrollment_no: Optional[str] = None
    date_of_birth: Optional[str] = None
    blood_group: Optional[str] = None
    aadhar_no: Optional[str] = None
    personal_email: Optional[str] = None
    mobile_no: Optional[str] = None
    father_name: Optional[str] = None
    father_occupation: Optional[str] = None
    father_mobile: Optional[str] = None
    mother_name: Optional[str] = None
    mother_occupation: Optional[str] = None
    mother_mobile: Optional[str] = None
    local_address: Optional[str] = None
    permanent_address: Optional[str] = None
    ssc: Optional[str] = None
    hsc: Optional[str] = None
    diploma: Optional[str] = None
    sport: Optional[str] = None
    other: Optional[str] = None
    photo: Optional[str] = None
    is_ban : Optional[bool] = False
    nss_member: bool = False
    ember_member: bool = False
    rhythm_member: bool = False

    student_id: Optional[uuid.UUID] = Field(default=None, foreign_key="student.id")
    student: Optional["Student"] = Relationship(back_populates="personal_info")
