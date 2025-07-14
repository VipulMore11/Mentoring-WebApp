import os
import time
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.hash import bcrypt
from pydantic import BaseModel
from models import Mentor

from database import SessionDep

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXP = int(os.getenv("EXP", 3600))


def create_token(user_id: str):
    payload = {"sub": user_id, "exp": time.time() + EXP}
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM or "HS256"])
        return payload
    except Exception as _:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )


class Token(BaseModel):
    access_token: str


def hash_password(password):
    return bcrypt.hash(password)


def verify_password(password, hash):
    return bcrypt.verify(password, hash)


security = HTTPBearer()


def get_mentor(
    session: SessionDep,
    bearer: Annotated[HTTPAuthorizationCredentials, Depends(security)],
):
    payload = verify_token(bearer.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    mentor = session.get(Mentor, payload["sub"])
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    return mentor
    
MentorDep = Annotated[Mentor, Depends(get_mentor)]