from pydantic import BaseModel
from typing import Optional


class CategoriaCreate(BaseModel):
    nombre: str


class CategoriaResponse(BaseModel):
    id: int
    nombre: str
    created_at: Optional[str] = None


class InsumoCreate(BaseModel):
    nombre_insumo: str
    precio_compra: float
    cantidad: Optional[float] = None
    unidad_medida: Optional[str] = None
    categoria: str


class InsumoUpdate(BaseModel):
    nombre_insumo: Optional[str] = None
    precio_compra: Optional[float] = None
    cantidad: Optional[float] = None
    unidad_medida: Optional[str] = None
    categoria: Optional[str] = None


class InsumoResponse(BaseModel):
    id_insumo: int
    nombre_insumo: str
    precio_compra: float
    cantidad: Optional[float] = None
    unidad_medida: Optional[str] = None
    id_categoria: int
    nombre_categoria: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
