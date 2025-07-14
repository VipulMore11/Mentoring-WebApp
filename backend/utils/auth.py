# auth.py
from fastapi import APIRouter, Request, Depends
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.responses import JSONResponse, HTMLResponse
from sqlmodel import Session, select
from models.personal_info import PersonalInfo
from models.student import Student
from database import get_session
from security import create_token

import os

config = Config('.env')

oauth = OAuth(config)

oauth.register(
    name='google',
    client_id=config('GOOGLE_CLIENT_ID'),
    client_secret=config('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    api_base_url='https://www.googleapis.com/oauth2/v2/',
    client_kwargs={'scope': 'openid email profile'},
)


router = APIRouter()


@router.get('/auth/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get('/auth/callback')
async def auth_callback(
    request: Request,
    session: Session = Depends(get_session)
):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = await oauth.google.get('userinfo', token=token)
        user_info = user_info.json()


        email = user_info.get('email')
        name = user_info.get('name')

        statement = select(PersonalInfo).where(PersonalInfo.atharva_email == email)
        user = session.exec(statement).first()

        if not user:
            user = PersonalInfo(atharva_email=email, name=name)
            session.add(user)
            session.commit()
            session.refresh(user)

        if not user.student_id:
            student = Student()
            session.add(student)
            session.commit()
            session.refresh(student)

            user.student_id = student.id
            session.add(user)
            session.commit()
            session.refresh(user)

        jwt_token = create_token(str(user.id))

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Successful</title>
        </head>
        <body>
            <script>
                // Send success message to parent window
                if (window.opener) {{
                    window.opener.postMessage({{
                        type: 'AUTH_SUCCESS',
                        access_token: '{jwt_token}',
                        user: {{
                            email: '{user.atharva_email}',
                            name: '{user.name}',
                            picture: '{user.photo or ""}'
                        }}
                    }}, '*');
                }}
                
                // Close the popup
                window.close();
            </script>
            <p>Authentication successful! This window will close automatically.</p>
        </body>
        </html>
        """
        
        return HTMLResponse(content=html_content)

    except Exception as e:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Failed</title>
        </head>
        <body>
            <script>
                // Send error message to parent window
                if (window.opener) {{
                    window.opener.postMessage({{
                        type: 'AUTH_ERROR',
                        error: 'Authentication failed: {str(e)}'
                    }}, '*');
                }}
                
                // Close the popup
                window.close();
            </script>
            <p>Authentication failed. This window will close automatically.</p>
        </body>
        </html>
        """
        
        return HTMLResponse(content=html_content)