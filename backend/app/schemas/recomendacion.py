from pydantic import BaseModel


class RecomendacionResponse(BaseModel):
    id_receta: int
    nombre_receta: str
    modalidad: str = "en_desarrollo"
    mensaje: str = "Esta funcionalidad está en desarrollo. Pronto recibirás recomendaciones inteligentes de producción para este producto."
