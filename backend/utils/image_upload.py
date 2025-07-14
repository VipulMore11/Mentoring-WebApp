import os
from fastapi import UploadFile, HTTPException, status
from cloudinary.uploader import upload
import cloudinary
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

async def upload_image(image: UploadFile, id: str) -> str:
    try:
        public_id = f"users/{id}"
        
        upload_result = upload(
            image.file,
            public_id=public_id,
            overwrite=True
        )
        file_url = upload_result.get('secure_url')
        return file_url
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading image: {str(e)}"
        )
