from typing import List, Optional

from sqlmodel import select

from app.db.db import get_sync_session
from app.db.models import Athletes
from app.schemas.athletes import AthleteCreate, AthleteUpdate


def create_athlete(athlete: AthleteCreate) -> Athletes:
    with get_sync_session() as session:
        db_athlete = Athletes(**athlete.model_dump())
        session.add(db_athlete)
        session.commit()
        session.refresh(db_athlete)
        return db_athlete


def get_athlete_by_id(athlete_id: int) -> Optional[Athletes]:
    with get_sync_session() as session:
        return session.get(Athletes, athlete_id)


def get_all_athletes() -> List[Athletes]:
    with get_sync_session() as session:
        statement = select(Athletes)
        return list(session.exec(statement).all())


def update_athlete(athlete_id: int, update_data: AthleteUpdate) -> Optional[Athletes]:
    with get_sync_session() as session:
        db_athlete = session.get(Athletes, athlete_id)
        if not db_athlete:
            return None
        for key, value in update_data.model_dump(exclude_unset=True).items():
            setattr(db_athlete, key, value)
        session.commit()
        session.refresh(db_athlete)
        return db_athlete


def delete_athlete(athlete_id: int) -> bool:
    with get_sync_session() as session:
        db_athlete = session.get(Athletes, athlete_id)
        if not db_athlete:
            return False
        session.delete(db_athlete)
        session.commit()
        return True


# Jerry 488
# May 537
# Olivia 359
