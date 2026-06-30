from pydantic import BaseModel
from typing import Optional


class RecetaInsumoCreate(BaseModel):
    id_insumo: int
    cantidad_usada: float
    costo_parcial: float


class RecetaCreate(BaseModel):
    nombre_receta: str
    porcentaje_ganancia: float
    produccion: float
    costo_unidad: float
    precio_unidad: float
    ganancia_unidad: float
    total_costo: float
    total_unidad: float
    total_ganancia: float
    ingredientes: list[RecetaInsumoCreate]


class RecetaInsumoResponse(BaseModel):
    id_receta_insumo: int
    id_insumo: int
    nombre_insumo: str
    cantidad_usada: float
    costo_parcial: float


class RecetaResponse(BaseModel):
    id_receta: int
    nombre_receta: str
    porcentaje_ganancia: float
    produccion: float
    costo_unidad: float
    precio_unidad: float
    ganancia_unidad: float
    total_costo: float
    total_unidad: float
    total_ganancia: float
    ingredientes: list[RecetaInsumoResponse]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
