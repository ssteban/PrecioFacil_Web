from pydantic import BaseModel
from typing import Optional


class RecomendacionResponse(BaseModel):
    id_receta: int
    nombre_receta: str
    modalidad: str = "en_desarrollo"
    mensaje: str = "Esta funcionalidad está en desarrollo. Pronto recibirás recomendaciones inteligentes de producción para este producto."


class RecomendacionDetalleResponse(BaseModel):
    id_receta: int
    nombre_receta: str
    modalidad: str = "free"
    fase: str
    cantidad_sugerida: Optional[int] = None
    motivo: str
    cold_start: bool = False
