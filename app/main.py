import asyncio
import csv
import os
from datetime import date, datetime
from io import StringIO

import pandas as pd

from app.db.db import get_sync_session
from app.db.models.shots_model import ShotLog

# Set path to /data directory
data_dir = "data"


# Find the CSV file with 8-digit name (yyyymmdd format)
filename = next(
    f for f in os.listdir(data_dir) if f.endswith(".csv") and f[:8].isdigit()
)
file_path = os.path.join(data_dir, filename)

# Extract date from filename
date_str = filename[:8]
date_obj = datetime.strptime(date_str, "%Y%m%d").date()

# Column names from SIUS documentation
columns = [
    "Start_NR",
    "Primary_score",
    "Match_shot",
    "Firingpoint",
    "Secondary_score",
    "Divisions",
    "Time",
    "Innerten",
    "X",
    "Y",
    "Intime",
    "Time_since_change",
    "Sweep_direction",
    "Demonstration",
    "Shoot",
    "Practice",
    "InsDel",
    "Totalkind",
    "Group",
    "Firekind",
    "Logevent",
    "Logtype",
    "Time_of_year",
    "Relay",
    "Weapon",
    "Position",
    "TargetID",
    "External_number",
]

# Load CSV
df = pd.read_csv(file_path, sep=";", header=None, names=columns)

# Add the date as a new column
df["Date"] = date_obj

# View the DataFrame
print(df.head())

df.to_csv(
    os.path.join(data_dir, f"converted_{filename}"),
    index=False,
)


async def load_csv_to_db(file_path):
    with open(file_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.reader(csvfile, delimiter=";")

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


asyncio.run(load_csv_to_db(file_path))
