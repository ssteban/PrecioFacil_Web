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
    created_at: Optional[str] = None


class MessageResponse(BaseModel):
    status: str
    message: str
