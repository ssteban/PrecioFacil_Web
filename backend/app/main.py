from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_route, insumo_route, receta_route, venta_diaria_route


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Ok"}

@app.head("/health")
async def health():
    return {"message": "Ok"}


app.include_router(auth_route.router, prefix="/auth", tags=["auth"])
app.include_router(insumo_route.router, prefix="/api", tags=["insumos"])
app.include_router(receta_route.router, prefix="/api", tags=["recetas"])
app.include_router(venta_diaria_route.router, prefix="/api", tags=["ventas"])
