from fastapi import APIRouter, HTTPException, status
from app.schemas.insumo import CategoriaCreate, CategoriaResponse, InsumoCreate, InsumoUpdate, InsumoResponse
from app.db.insumo_query import CategoriaQuery, InsumoQuery

router = APIRouter()


@router.post("/categorias", status_code=status.HTTP_201_CREATED)
async def crear_categoria(body: CategoriaCreate):
    result = CategoriaQuery.create_categoria(body.nombre)
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"id": result["id"], "nombre": body.nombre.strip()}


@router.get("/categorias")
async def listar_categorias():
    result = CategoriaQuery.get_categorias()
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["categorias"]


@router.delete("/categorias/{id_categoria}")
async def eliminar_categoria(id_categoria: int):
    result = CategoriaQuery.delete_categoria(id_categoria)
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"message": "Categoría eliminada"}


@router.post("/insumos", status_code=status.HTTP_201_CREATED)
async def crear_insumo(body: InsumoCreate):
    result = InsumoQuery.create_insumo(
        nombre_insumo=body.nombre_insumo,
        precio_compra=body.precio_compra,
        cantidad=body.cantidad,
        unidad_medida=body.unidad_medida,
        categoria=body.categoria,
    )
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"id": result["id"]}


@router.get("/insumos")
async def listar_insumos():
    result = InsumoQuery.get_insumos()
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["insumos"]


@router.put("/insumos/{id_insumo}")
async def actualizar_insumo(id_insumo: int, body: InsumoUpdate):
    result = InsumoQuery.update_insumo(
        id_insumo=id_insumo,
        nombre_insumo=body.nombre_insumo,
        precio_compra=body.precio_compra,
        cantidad=body.cantidad,
        unidad_medida=body.unidad_medida,
        categoria=body.categoria,
    )
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"message": "Insumo actualizado"}


@router.delete("/insumos/{id_insumo}")
async def eliminar_insumo(id_insumo: int):
    result = InsumoQuery.delete_insumo(id_insumo)
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"message": "Insumo eliminado"}
