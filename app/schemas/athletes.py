from typing import Optional

from pydantic import BaseModel


class AthleteBase(BaseModel):
    id: int
    first_name: str
    last_name: str
    active: bool = True


class AthleteCreate(AthleteBase):
    pass


class AthleteRead(AthleteBase):
    pass


class AthleteUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    active: Optional[bool] = None
