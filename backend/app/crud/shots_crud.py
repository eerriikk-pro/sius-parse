from datetime import date, time, timedelta
from typing import List

from app.db.db import get_sync_session
from app.db.models.shots_model import ShotLog
from pydantic import BaseModel
from sqlmodel import and_, select


class Shot(BaseModel):
    shot_time: time
    primary_score: float
    secondary_score: float
    x_mm: float
    y_mm: float


class RelayStats(BaseModel):
    total_shots: int
    total_score: float
    best_score: float
    average_score: float
    list_of_shots: List[Shot]


class DayStats(BaseModel):
    day: date
    total_shots: int
    total_sighters: int
    best_score: float
    list_of_relays: List[RelayStats]
    list_of_sighters: List[Shot]


def get_recent_scores(athlete_id: int, days: int = 10) -> List[DayStats]:
    today = date.today()
    start_date = today - timedelta(days=days - 1)
    with get_sync_session() as session:
        statement = select(ShotLog).where(
            and_(
                ShotLog.athlete_id == athlete_id,
                ShotLog.shot_date >= start_date,
                ShotLog.shot_date <= today,
            )
        )
        shots = session.exec(statement).all()
    # Group by day
    days_dict = {}
    for shot in shots:
        d = shot.shot_date
        if d not in days_dict:
            days_dict[d] = []
        days_dict[d].append(shot)
    result = []
    for d in sorted(days_dict.keys(), reverse=True):
        day_shots = days_dict[d]
        # Sighters
        sighters = [s for s in day_shots if s.match_shot == 0]
        sighter_models = [
            Shot(
                shot_time=s.shot_time,
                primary_score=s.primary_score,
                secondary_score=s.secondary_score,
                x_mm=s.x_mm,
                y_mm=s.y_mm,
            )
            for s in sighters
        ]
        # Relay: all match shots (match_shot == 1)
        relay_shots = [s for s in day_shots if s.match_shot == 1]
        relay_models = [
            Shot(
                shot_time=s.shot_time,
                primary_score=s.primary_score,
                secondary_score=s.secondary_score,
                x_mm=s.x_mm,
                y_mm=s.y_mm,
            )
            for s in relay_shots
        ]
        total_score = sum(s.primary_score for s in relay_shots)
        best_score = max([s.primary_score for s in relay_shots], default=0)
        total_shots = len(relay_shots)
        avg_score = (total_score / total_shots) if total_shots else 0
        relay_stats = RelayStats(
            total_shots=total_shots,
            total_score=total_score,
            best_score=best_score,
            average_score=avg_score,
            list_of_shots=relay_models,
        )
        result.append(
            DayStats(
                day=d,
                total_shots=total_shots,
                total_sighters=len(sighters),
                best_score=best_score,
                list_of_relays=[relay_stats],
                list_of_sighters=sighter_models,
            )
        )
    return result


def get_stats(athlete_id: int, period: str = "10days") -> dict:
    # Parse period (e.g., "10days")
    days = 10
    if period.endswith("days"):
        try:
            days = int(period[:-4])
        except Exception:
            pass
    recent = get_recent_scores(athlete_id, days)
    all_scores = [
        shot.primary_score
        for day in recent
        for relay in day.list_of_relays
        for shot in relay.list_of_shots
    ]
    best_score = max(all_scores, default=0)
    avg_score = sum(all_scores) / len(all_scores) if all_scores else 0
    # For delta, compare to previous period
    previous = get_recent_scores(athlete_id, days * 2)[days:]
    prev_scores = [
        shot.primary_score
        for day in previous
        for relay in day.list_of_relays
        for shot in relay.list_of_shots
    ]
    prev_best = max(prev_scores, default=0)
    prev_avg = sum(prev_scores) / len(prev_scores) if prev_scores else 0
    return {
        "best_score": best_score,
        "average_score": avg_score,
        "best_score_delta": best_score - prev_best,
        "average_score_delta": avg_score - prev_avg,
    }


def get_shots_by_day(athlete_id: int, shot_date: date) -> DayStats:
    with get_sync_session() as session:
        statement = select(ShotLog).where(
            and_(ShotLog.athlete_id == athlete_id, ShotLog.shot_date == shot_date)
        )
        shots = session.exec(statement).all()
    sighters = [s for s in shots if s.match_shot == 0]
    sighter_models = [
        Shot(
            shot_time=s.shot_time,
            primary_score=s.primary_score,
            secondary_score=s.secondary_score,
            x_mm=s.x_mm,
            y_mm=s.y_mm,
        )
        for s in sighters
    ]
    relay_shots = [s for s in shots if s.match_shot == 1]
    relay_models = [
        Shot(
            shot_time=s.shot_time,
            primary_score=s.primary_score,
            secondary_score=s.secondary_score,
            x_mm=s.x_mm,
            y_mm=s.y_mm,
        )
        for s in relay_shots
    ]
    total_score = sum(s.primary_score for s in relay_shots)
    best_score = max([s.primary_score for s in relay_shots], default=0)
    total_shots = len(relay_shots)
    avg_score = (total_score / total_shots) if total_shots else 0
    relay_stats = RelayStats(
        total_shots=total_shots,
        total_score=total_score,
        best_score=best_score,
        average_score=avg_score,
        list_of_shots=relay_models,
    )
    return DayStats(
        day=shot_date,
        total_shots=total_shots,
        total_sighters=len(sighters),
        best_score=best_score,
        list_of_relays=[relay_stats],
        list_of_sighters=sighter_models,
    )


def get_shots_by_set(athlete_id: int, shot_date: date, set_id: int) -> List[RelayStats]:
    # For now, just return the relay for the day if set_id == 1, else empty
    if set_id != 1:
        return []
    day_stats = get_shots_by_day(athlete_id, shot_date)
    return day_stats.list_of_relays
