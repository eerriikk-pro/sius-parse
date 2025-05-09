from typing import Optional

from sqlalchemy import or_
from sqlmodel import select

from app.db.db import get_sync_session
from app.db.models import User, UserCreate
from app.security.hash import get_password_hash


def create_user(user: UserCreate, disabled: bool = False, admin: bool = False) -> User:
    hashed_password = get_password_hash(user.password)
    with get_sync_session() as session:
        statement = select(User).where(
            or_(User.email == user.email, User.username == user.username)
        )
        db_user = session.exec(statement).first()
        if db_user:
            raise ValueError("User already exists")
        user = User(
            **user.model_dump(exclude=["password"]),
            hashed_password=hashed_password,
            disabled=disabled,
            is_admin=admin,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    return user.model_copy()


def get_user(username: str) -> Optional[User]:
    with get_sync_session() as session:
        statement = select(User).where(User.username == username)
        user = session.exec(statement).first()
        if not user:
            return None
        return user
