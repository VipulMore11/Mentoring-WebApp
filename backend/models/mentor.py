from typing import Optional, TYPE_CHECKING, List
import uuid
from sqlmodel import SQLModel, Field, Relationship


if TYPE_CHECKING:
 from models import Student

class Mentor(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str
    password: str
    semester: str
    mentor_name: str
    students: List["Student"] = Relationship(back_populates="mentor")