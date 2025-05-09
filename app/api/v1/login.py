from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel

from app.crud.user_crud import create_user
from app.db.models.user_model import User, UserBase, UserCreate
from app.security.hash import create_jwt_token
from app.security.user_auth import authenticate_user, get_current_active_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_jwt_token(data={"sub": user.username})
    return Token(access_token=access_token, token_type="bearer")


@router.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@router.post("/users", response_model=UserBase)
async def add_user(user: UserCreate):
    created_user = create_user(user)
    return UserBase(
        **created_user.model_dump(
            include={"username", "email", "full_name", "athlete_id"}
        )
    )
