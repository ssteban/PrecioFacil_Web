from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class RegisterRequest(BaseModel):
    username: str
    correo: EmailStr
    contrasena: str
    pais: str
    departamento: str
    ciudad: str
    nombre_emprendimiento: str
    tipo_negocio: str
    medios_pago: str = 'EN_BLANCO'


class LoginRequest(BaseModel):
    correo: EmailStr
    contrasena: str


class UserResponse(BaseModel):
    id: int
    username: str
    correo: str
    pais: str
    departamento: str
    ciudad: str
    plan: str = 'FREE'
    limite_recetas_total: int = 5
    created_at: Optional[str] = None


class MessageResponse(BaseModel):
    status: str
    message: str
