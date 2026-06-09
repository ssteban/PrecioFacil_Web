from fastapi import FastAPI
from app.routes import auth_route


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Ok"}

@app.HEAD("/health")
async def health():
    return {"message": "Ok"}


app.include_router(auth_route.router, prefix="/auth", tags=["auth"])
