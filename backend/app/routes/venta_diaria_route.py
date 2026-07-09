from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.venta_diaria import VentaDiariaCreate
from app.db.venta_diaria_query import VentaDiariaQuery
from app.deps.auth_deps import get_current_user

router = APIRouter()


@router.post("/ventas-diarias", status_code=status.HTTP_201_CREATED)
async def crear_venta(body: VentaDiariaCreate, current_user: dict = Depends(get_current_user)):
    result = VentaDiariaQuery.create_venta(
        id_receta=body.id_receta,
        fecha_venta=body.fecha_venta,
        unidades_vendidas=body.unidades_vendidas,
        unidades_sobrantes=body.unidades_sobrantes,
        ingreso_total=body.ingreso_total,
        ganancia_neta_total=body.ganancia_neta_total,
        empresa_id=current_user["empresa_id"],
    )
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"id": result["id"]}


@router.get("/ventas-diarias")
async def listar_ventas(current_user: dict = Depends(get_current_user)):
    result = VentaDiariaQuery.get_ventas(current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["ventas"]


@router.get("/ventas-diarias/receta/{id_receta}")
async def listar_ventas_por_receta(id_receta: int, current_user: dict = Depends(get_current_user)):
    result = VentaDiariaQuery.get_ventas_por_receta(id_receta, current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["ventas"]
