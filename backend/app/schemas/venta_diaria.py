from pydantic import BaseModel
from typing import Optional
from datetime import date


class VentaDiariaCreate(BaseModel):
    id_receta: int
    fecha_venta: date
    unidades_vendidas: int
    unidades_sobrantes: int
    ingreso_total: float
    ganancia_neta_total: float


class VentaDiariaResponse(BaseModel):
    id_venta: int
    id_receta: int
    fecha_venta: str
    unidades_vendidas: int
    unidades_sobrantes: int
    ingreso_total: float
    ganancia_neta_total: float
    nombre_receta: Optional[str] = None
    created_at: Optional[str] = None
