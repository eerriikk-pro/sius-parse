from typing import Optional

from app.db.db import get_sync_session
from app.db.models import User, UserCreate
from app.security.hash import get_password_hash
from sqlalchemy import or_
from sqlmodel import select


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


def get_user_by_any_identifier(identifier: str) -> Optional[User]:
    """
    Get user by username, email, or member number (athlete_id).
    For member number, we search by athlete_id.
    """
    with get_sync_session() as session:
        # Try to parse as integer for member number
        try:
            member_id = int(identifier)
            # Search by athlete_id
            statement = select(User).where(User.athlete_id == member_id)
            user = session.exec(statement).first()
            if user:
                return user
        except ValueError:
            # Not a number, continue with string search
            pass

        # Search by username or email
        statement = select(User).where(
            or_(User.username == identifier, User.email == identifier)
        )
        user = session.exec(statement).first()
        if not user:
            return None
        return user
