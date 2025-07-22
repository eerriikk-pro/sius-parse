from datetime import date
from typing import List

from app.crud.shots_crud import (
    DayStats,
    RelayStats,
    get_recent_scores,
    get_shots_by_day,
    get_shots_by_set,
    get_stats,
)
from app.db.models.user_model import User
from app.security.user_auth import get_current_active_user
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/recent-scores", response_model=List[DayStats])
async def api_get_recent_scores(
    days: int = 10, user: User = Depends(get_current_active_user)
):
    return get_recent_scores(user.athlete_id, days)


@router.get("/stats")
async def api_get_stats(
    period: str = "10days", user: User = Depends(get_current_active_user)
):
    return get_stats(user.athlete_id, period)


@router.get("/by-day", response_model=DayStats)
async def api_get_shots_by_day(
    date_: date, user: User = Depends(get_current_active_user)
):
    return get_shots_by_day(user.athlete_id, date_)


@router.get("/by-set", response_model=List[RelayStats])
async def api_get_shots_by_set(
    date_: date, set_id: int, user: User = Depends(get_current_active_user)
):
    return get_shots_by_set(user.athlete_id, date_, set_id)
