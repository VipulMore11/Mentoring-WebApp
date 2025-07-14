from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import uuid

if TYPE_CHECKING:
    from models import Student

class Counseling(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    sr_no: int
    topic: str
    date: str
    action_taken: str
    remark: str
    sign: str
    student_id: Optional[uuid.UUID] = Field(default=None, foreign_key="student.id")
    student: Optional["Student"] = Relationship(back_populates="counseling") 