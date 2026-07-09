from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import RegisterRequest, LoginRequest, UserResponse, MessageResponse
from app.db.auth_query import AuthQuery
from app.util.jwt_util import create_token

router = APIRouter()


@router.post("/login")
async def login(body: LoginRequest):
    result = AuthQuery.authenticate_user(body.correo, body.contrasena)
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result["message"])

    user_data = UserResponse(
        id=result["id"],
        username=result["username"],
        correo=result["correo"],
        pais=result["pais"],
        departamento=result["departamento"],
        ciudad=result["ciudad"],
        plan=result.get("plan", "FREE"),
        limite_recetas_total=result.get("limite_recetas_total", 5),
        created_at=result.get("created_at"),
    )

    token = create_token({
        "sub": str(result["id"]),
        "empresa_id": result["empresa_id"],
        "plan": result.get("plan", "FREE"),
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data.model_dump(),
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    result = AuthQuery.register_user(
        username=body.username,
        correo=body.correo,
        contrasena=body.contrasena,
        pais=body.pais,
        departamento=body.departamento,
        ciudad=body.ciudad,
        nombre_emprendimiento=body.nombre_emprendimiento,
        tipo_negocio=body.tipo_negocio,
        medios_pago=body.medios_pago
    )
    if result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])
    return MessageResponse(status="success", message="Usuario registrado exitosamente")


@router.post("/recover-password")
async def recover_password():
    return {"message": "Recover Password"}
