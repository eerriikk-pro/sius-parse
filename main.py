from io import StringIO

import pandas as pd

data = """
537;10;1;2;10.7;213;10:26:20.69;1;-2.04397;0.62515;1;568.3;0;0;0;0;2;0;0;0;4;12;46958069;65535;255;255;60;0
537;9;0;2;9.9;823;10:26:57.94;0;3.20991;7.58026;1;605.28;0;0;2;0;0;0;0;0;8;3;46961794;0;0;0;60;736
537;10;0;2;10.0;798;10:27:13.30;0;6.08611;-5.16649;1;620.64;0;0;2;0;0;0;0;0;9;3;46963330;0;0;0;60;736
"""

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

df = pd.read_csv(StringIO(data.strip()), sep=";", header=None, names=columns)

print(df.head())
