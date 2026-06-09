from fastapi import APIRouter

router = APIRouter()


@router.get("/login")
async def login():
    return {"message": "Login"}



@router.get("/register")
async def register():
    return {"message": "Register"}

@router.get("/recover-password")
async def recover_password():
    return {"message": "Recover Password"}