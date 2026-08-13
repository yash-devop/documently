from fastapi import FastAPI
from .modules.auth.router import auth_router
app = FastAPI();

app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "working": "ok"
    }