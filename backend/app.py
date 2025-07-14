from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import uvicorn
import os

import database
from routers import student, mentor
from utils.auth import router as auth_router

app = FastAPI()

# Add SessionMiddleware for OAuth
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# CORS
origins = [
    "http://localhost:3000",  # React frontend
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database.create_db_and_tables()

app.include_router(student.router)
app.include_router(mentor.router)

@app.get("/health-check")
def health_check():
    return {"message": "Server running..."}

app.include_router(auth_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("PORT", 8000)))
