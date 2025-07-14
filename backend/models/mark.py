from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import uuid
from enum import Enum

if TYPE_CHECKING:
    from models import Student
class Sem(str, Enum):
    sem1 = "sem1"
    sem2 = "sem2"
    sem3 = "sem3"
    sem4 = "sem4"
    sem5 = "sem5"
    sem6 = "sem6"
    sem7 = "sem7"
    sem8 = "sem8"
    
class Mark(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    semester: Optional[Sem] = Field(default=None)
    marks: str
    no_of_kt: str
    kt_subject: str
    student_id: Optional[uuid.UUID] = Field(default=None, foreign_key="student.id")
    student: Optional["Student"] = Relationship(back_populates="marks") 