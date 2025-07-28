from typing import List

from app.crud.athlete_crud import (
    create_athlete,
    delete_athlete,
    get_all_athletes,
    get_athlete_by_id,
    update_athlete,
)
from app.db.models.user_model import User
from app.schemas.athletes import AthleteCreate, AthleteRead, AthleteUpdate
from app.security.user_auth import get_current_active_user, get_current_superuser
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.post(
    "",
    response_model=AthleteRead,
    dependencies=[Depends(get_current_superuser)],
)
def add_athlete(athlete: AthleteCreate):
    return create_athlete(athlete)


@router.get(
    "",
    response_model=List[AthleteRead],
    dependencies=[Depends(get_current_superuser)],
)
def list_athletes():
    return get_all_athletes()


@router.get(
    "/{athlete_id}",
    response_model=AthleteRead,
)
def read_athlete(athlete_id: int, user: User = Depends(get_current_active_user)):
    if user.athlete_id != athlete_id and not user.is_admin:
        raise HTTPException(
            status_code=403, detail="Only admins can access other athletes info"
        )
    athlete = get_athlete_by_id(athlete_id)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return athlete


@router.put(
    "/{athlete_id}",
    response_model=AthleteRead,
    dependencies=[Depends(get_current_superuser)],
)
def update_athlete_endpoint(athlete_id: int, update: AthleteUpdate):
    updated = update_athlete(athlete_id, update)
    if not updated:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return updated


@router.delete(
    "/{athlete_id}",
    dependencies=[Depends(get_current_superuser)],
)
def delete_athlete_endpoint(athlete_id: int):
    success = delete_athlete(athlete_id)
    if not success:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return {"ok": True}
