import logging
from fastapi import Header, HTTPException
from app.util.jwt_util import verify_token

logger = logging.getLogger(__name__)


def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Token inválido')
    try:
        token = authorization.split(' ')[1]
        return verify_token(token)
    except Exception as e:
        logger.error(f"Error verificando token: {e}")
        raise HTTPException(status_code=401, detail=f'Token inválido')
