from fastapi import APIRouter, HTTPException, status, Depends
from app.db.recomendacion_query import RecomendacionQuery
from app.deps.auth_deps import get_current_user

router = APIRouter()


@router.get("/recomendaciones")
async def listar_recomendaciones(current_user: dict = Depends(get_current_user)):
    result = RecomendacionQuery.get_recomendaciones(current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["recomendaciones"]
