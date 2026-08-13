from fastapi import APIRouter
from .schema import RegisterSchema


auth_router = APIRouter(prefix="/auth", tags=["Auth"])


@auth_router.post("/register")
def register(data: RegisterSchema):
    return {
        "email": data.email,
        "message": "Registration successfull"
    }