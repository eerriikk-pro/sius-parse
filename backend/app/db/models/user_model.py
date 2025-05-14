from typing import Optional

from pydantic import BaseModel, EmailStr
from sqlmodel import Field, SQLModel


class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    athlete_id: Optional[int] = None


class UserCreate(UserBase):
    password: str


class User(UserBase, SQLModel, table=True):
    __tablename__ = "users"
    username: str = Field(primary_key=True)
    athlete_id: Optional[int] = Field(default=None, foreign_key="athletes.id")
    hashed_password: str
    disabled: bool = False
    is_admin: bool = False
