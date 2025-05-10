import csv
from datetime import datetime

from fastapi import UploadFile

from app.db.db import get_sync_session
from app.db.models import ShotLog


async def load_csv_file(file: UploadFile):
    contents = await file.read()
    filename = file.filename
    date_str = filename[:8]
    date_obj = datetime.strptime(date_str, "%Y%m%d").date()

    decoded = contents.decode("utf-8").splitlines()
    reader = csv.reader(decoded, delimiter=";")

    with get_sync_session() as session:
        for row in reader:
            shot_time_obj = datetime.strptime(row[6], "%H:%M:%S.%f").time()
            shot_log = ShotLog(
                athlete_id=int(row[0]),
                primary_score=float(row[1]),
                match_shot=int(row[2]),
                firing_point=int(row[3]),
                secondary_score=float(row[4]),
                divisions=int(row[5]),
                shot_time=shot_time_obj,
                shot_date=date_obj,
                inner_ten=bool(int(row[7])),
                x_mm=float(row[8]),
                y_mm=float(row[9]),
                in_time=bool(int(row[10])),
                time_since_change=float(row[11]),
                sweep_direction=int(row[12]),
                demonstration=bool(int(row[13])),
                shoot_index=int(row[14]),
                practice_index=int(row[15]),
                insdel=int(row[16]),
                total_kind=int(row[17]),
                group_enum=int(row[18]),
                fire_kind=int(row[19]),
                log_event=int(row[20]),
                log_type=int(row[21]),
                time_of_year=float(row[22]),
                relay_number=int(row[23]),
                weapon_type=int(row[24]),
                shooting_position=int(row[25]),
                target_id=int(row[26]),
                external_number=int(row[27]) if row[27] else None,
            )
            session.add(shot_log)
        session.commit()
