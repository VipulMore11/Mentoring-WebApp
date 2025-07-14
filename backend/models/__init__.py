from .student import Student
from .personal_info import PersonalInfo
from .mark import Mark
from .achievement import Achievement
from .mentor import Mentor
from .counseling import Counseling

__all__ = [
    "Student", "PersonalInfo", "Mark", "Achievement", "Mentor", "Counseling"
]

for model_name in __all__:
    model = globals().get(model_name)
    if model and hasattr(model, "model_rebuild"):
        model.model_rebuild()
