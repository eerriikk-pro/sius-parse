from typing import Annotated, Optional

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.crud.user_crud import get_user
from app.db.models.user_model import User
from app.security.hash import credentials_exception, decode_jwt_token, verify_password


def authenticate_user(username: str, password: str) -> Optional[User]:
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    payload = decode_jwt_token(token)
    username = payload.get("sub")
    if username is None:
        raise credentials_exception
    user = get_user(username=username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
