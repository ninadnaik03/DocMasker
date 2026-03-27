from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="DocMasker Production API")

app.include_router(router)