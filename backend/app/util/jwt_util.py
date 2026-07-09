import os
import jwt
from datetime import datetime, timedelta

SECRET = os.getenv('JWT_SECRET', 'default-secret')
ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
EXPIRE_MINUTES = int(os.getenv('JWT_EXPIRE_MINUTES', '1440'))


def create_token(data: dict) -> str:
    payload = {
        **data,
        'exp': datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])
