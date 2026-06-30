import json
from fastapi import APIRouter, HTTPException, status
from app.schemas.receta import RecetaCreate
from app.db.receta_query import RecetaQuery

router = APIRouter()


@router.post("/recetas", status_code=status.HTTP_201_CREATED)
async def crear_receta(body: RecetaCreate):
    ingredientes = [ing.model_dump() for ing in body.ingredientes]
    result = RecetaQuery.create_receta(
        nombre_receta=body.nombre_receta,
        porcentaje_ganancia=body.porcentaje_ganancia,
        produccion=body.produccion,
        costo_unidad=body.costo_unidad,
        precio_unidad=body.precio_unidad,
        ganancia_unidad=body.ganancia_unidad,
        total_costo=body.total_costo,
        total_unidad=body.total_unidad,
        total_ganancia=body.total_ganancia,
        ingredientes=ingredientes,
    )
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"id": result["id"]}


@router.get("/recetas")
async def listar_recetas():
    result = RecetaQuery.get_recetas()
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["recetas"]


@router.get("/recetas/{id_receta}")
async def obtener_receta(id_receta: int):
    result = RecetaQuery.get_receta(id_receta)
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result["message"])
    return result["receta"]


@router.delete("/recetas/{id_receta}")
async def eliminar_receta(id_receta: int):
    result = RecetaQuery.delete_receta(id_receta)
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"message": "Receta eliminada"}


@router.put("/recetas/{id_receta}")
async def actualizar_receta(id_receta: int, body: RecetaCreate):
    ingredientes = [ing.model_dump() for ing in body.ingredientes]
    result = RecetaQuery.update_receta(
        id_receta=id_receta,
        nombre_receta=body.nombre_receta,
        porcentaje_ganancia=body.porcentaje_ganancia,
        produccion=body.produccion,
        costo_unidad=body.costo_unidad,
        precio_unidad=body.precio_unidad,
        ganancia_unidad=body.ganancia_unidad,
        total_costo=body.total_costo,
        total_unidad=body.total_unidad,
        total_ganancia=body.total_ganancia,
        ingredientes=ingredientes,
    )
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"id": result["id"]}
