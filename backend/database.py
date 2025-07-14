import os
from typing import Annotated
from dotenv import load_dotenv
from fastapi import Depends
from sqlalchemy.sql import true
from sqlmodel import Session, create_engine, SQLModel
from models import *

load_dotenv()

DB_URL = os.getenv("DB_URL")

if not DB_URL:
    raise ValueError("DB_URL not set in the environment variables")

engine = create_engine(DB_URL,echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)  

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
