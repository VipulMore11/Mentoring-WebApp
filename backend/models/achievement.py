from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import uuid

if TYPE_CHECKING:
    from models import Student

class Achievement(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    first_year: str
    second_year: str
    third_year: str
    final_year: str
    student_id: Optional[uuid.UUID] = Field(default=None, foreign_key="student.id")
    student: Optional["Student"] = Relationship(back_populates="achievements") 