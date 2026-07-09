from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.insumo import CategoriaCreate, CategoriaResponse, InsumoCreate, InsumoUpdate, InsumoResponse
from app.db.insumo_query import CategoriaQuery, InsumoQuery
from app.deps.auth_deps import get_current_user

router = APIRouter()


@router.post("/categorias", status_code=status.HTTP_201_CREATED)
async def crear_categoria(body: CategoriaCreate, current_user: dict = Depends(get_current_user)):
    result = CategoriaQuery.create_categoria(body.nombre, current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"id": result["id"], "nombre": body.nombre.strip()}


@router.get("/categorias")
async def listar_categorias(current_user: dict = Depends(get_current_user)):
    result = CategoriaQuery.get_categorias(current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["categorias"]


@router.delete("/categorias/{id_categoria}")
async def eliminar_categoria(id_categoria: int, current_user: dict = Depends(get_current_user)):
    result = CategoriaQuery.delete_categoria(id_categoria, current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"message": "Categoría eliminada"}


@router.post("/insumos", status_code=status.HTTP_201_CREATED)
async def crear_insumo(body: InsumoCreate, current_user: dict = Depends(get_current_user)):
    result = InsumoQuery.create_insumo(
        nombre_insumo=body.nombre_insumo,
        precio_compra=body.precio_compra,
        cantidad=body.cantidad,
        unidad_medida=body.unidad_medida,
        categoria=body.categoria,
        empresa_id=current_user["empresa_id"],
    )
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"id": result["id"]}


@router.get("/insumos")
async def listar_insumos(current_user: dict = Depends(get_current_user)):
    result = InsumoQuery.get_insumos(current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result["message"])
    return result["insumos"]


@router.put("/insumos/{id_insumo}")
async def actualizar_insumo(id_insumo: int, body: InsumoUpdate, current_user: dict = Depends(get_current_user)):
    result = InsumoQuery.update_insumo(
        id_insumo=id_insumo,
        empresa_id=current_user["empresa_id"],
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
async def eliminar_insumo(id_insumo: int, current_user: dict = Depends(get_current_user)):
    result = InsumoQuery.delete_insumo(id_insumo, current_user["empresa_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return {"message": "Insumo eliminado"}
