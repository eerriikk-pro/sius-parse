import os
from datetime import datetime
from io import StringIO

import pandas as pd

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
