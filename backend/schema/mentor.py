from pydantic import BaseModel

class MentorLoginRequest(BaseModel):
  email: str
  password: str

class MentorLoginResponse(BaseModel):
  access_token: str
  token_type: str = "Bearer"