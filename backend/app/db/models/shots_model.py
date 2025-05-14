from datetime import date, time
from typing import Optional

from sqlmodel import Field, SQLModel


class ShotLog(SQLModel, table=True):
    __tablename__ = "shot_log"

    athlete_id: int = Field(primary_key=True)
    shot_time: time = Field(
        primary_key=True, description="Timestamp when the shot occurred (HH:MM:SS.xx)"
    )
    shot_date: date = Field(primary_key=True, description="date on file name")

    primary_score: float  # Integer score (1–10) for pistol, 1–10.9 for rifle
    match_shot: int  # 0=Sighter, 1=Match, 8=Final
    firing_point: int  # Lane number
    secondary_score: float  # Decimal score, e.g., 10.7, 0 for rifle
    divisions: int  # 1/100 mm to center
    inner_ten: bool  # True if inner ten
    x_mm: float  # X coordinate in mm
    y_mm: float  # Y coordinate in mm
    in_time: bool  # Shot within time frame
    time_since_change: float  # In 0.01s since red/green switch
    sweep_direction: int  # 0=off/left, 1=right (for moving targets)
    demonstration: bool  # true=demo mode
    shoot_index: int  # Shoot index
    practice_index: int  # Practice index
    insdel: int  # 1=manual insert, 2=ignore
    total_kind: int  # 1=Group total, 2=Subtotal, 4=Grand total
    group_enum: int  # 0 or 1 (shot grouping)
    fire_kind: int  # 0=Sighter, 1=Single, 2=Series
    log_event: int  # Incremental event
    log_type: int  # 3=OwnShot, 10=CrossShot, 12=IllegalShot
    time_of_year: float  # Time since year start in 0.01s
    relay_number: int  # Relay number
    weapon_type: int  # 0–21
    shooting_position: int  # 0=Prone, 2=Standing, 3=Kneeling, 4=Supported
    target_id: int  # Target ID
    external_number: Optional[int] = None  # External shooter ID

    import_date: date = Field(
        default_factory=date.today, description="Date the log entry was imported"
    )
