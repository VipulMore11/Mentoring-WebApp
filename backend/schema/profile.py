from pydantic import BaseModel
from typing import Optional, List
from models.mark import Sem
import uuid

class MarkUpdate(BaseModel):
    semester: Sem         
    marks: str
    no_of_kt: str
    kt_subject: str

class CounselingUpdate(BaseModel):
    sr_no: int
    topic: str
    date: str
    action_taken: str
    remark: str
    sign: str

class AchievementUpdate(BaseModel):
    first_year: str
    second_year: str
    third_year: str
    final_year: str

class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    atharva_email: Optional[str] = None
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
    nss_member: Optional[bool] = None
    ember_member: Optional[bool] = None
    rhythm_member: Optional[bool] = None

class CombinedUpdateRequest(BaseModel):
    personal_info: Optional[PersonalInfoUpdate]
    marks: Optional[List[MarkUpdate]]
    achievements: Optional[AchievementUpdate]
    counseling: Optional[List[CounselingUpdate]]

class PersonalInfoOut(BaseModel):
    id: Optional[uuid.UUID]
    name: Optional[str]
    enrollment_no: Optional[str]
    date_of_birth: Optional[str]
    blood_group: Optional[str]
    aadhar_no: Optional[str]
    personal_email: Optional[str]
    mobile_no: Optional[str]
    father_name: Optional[str]
    father_occupation: Optional[str]
    father_mobile: Optional[str]
    mother_name: Optional[str]
    mother_occupation: Optional[str]
    mother_mobile: Optional[str]
    local_address: Optional[str]
    permanent_address: Optional[str]
    photo: Optional[str]
    ssc: Optional[str]
    hsc: Optional[str]
    diploma: Optional[str]
    sport: Optional[str]
    other: Optional[str]
    nss_member: Optional[bool]
    ember_member: Optional[bool]
    rhythm_member: Optional[bool]
    model_config = {"from_attributes": True}

class MarkOut(BaseModel):
    semester: str
    marks: str
    no_of_kt: str
    kt_subject: str
    model_config = {"from_attributes": True}


class CounselingOut(BaseModel):
    sr_no: int
    topic: str
    date: str
    action_taken: str
    remark: str
    sign: str
    model_config = {"from_attributes": True}

class AchievementOut(BaseModel):
    first_year: str
    second_year: str
    third_year: str
    final_year: str
    model_config = {"from_attributes": True}

class StudentProfileResponse(BaseModel):
    personal_info: Optional[PersonalInfoOut]
    achievements: Optional[AchievementOut]
    marks: List[MarkOut] = []
    counseling: List[CounselingOut] = []
    model_config = {"from_attributes": True}

