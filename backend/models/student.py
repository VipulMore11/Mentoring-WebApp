from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import uuid

if TYPE_CHECKING:
    from models import PersonalInfo, Mark, Achievement, Mentor, Counseling

class Student(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    personal_info: Optional["PersonalInfo"] = Relationship(back_populates="student")
    mentor_id: Optional[uuid.UUID] = Field(default=None, foreign_key="mentor.id")
    mentor: Optional["Mentor"] = Relationship(back_populates="students")
    marks: List["Mark"] = Relationship(back_populates="student")
    achievements: Optional["Achievement"] = Relationship(back_populates="student")
    counseling: List["Counseling"] = Relationship(back_populates="student")     