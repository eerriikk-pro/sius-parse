# sius-parse

# Hardcoded Values
| Index | Field Name        | Description                                        |
| ----- | ----------------- | -------------------------------------------------- |
| 0     | Start NR          | Shooter number                                     |
| 1     | Primary score     | Integer score (1–10)                               |
| 2     | Match shot        | 0=Sighter, 1=Match shot, 8=Final shot              |
| 3     | Firingpoint       | Lane number                                        |
| 4     | Secondary score   | Decimal score (e.g. 10.7)                          |
| 5     | Divisions         | Number of 100th millimeter to center               |
| 6     | Time              | Time mark (HH\:MM\:SS.xx)                          |
| 7     | Innerten          | 1=Inner ten, 0=Not                                 |
| 8     | X                 | X-coordinate in mm                                 |
| 9     | Y                 | Y-coordinate in mm                                 |
| 10    | Intime            | 1=within time frame, 0=out                         |
| 11    | Time since change | From red/green start, in 0.01s                     |
| 12    | Sweep direction   | 0=off/left, 1=right (running target)               |
| 13    | Demonstration     | 0=off, 1=on                                        |
| 14    | Shoot             | Index of the shoot                                 |
| 15    | Practice          | Practice index                                     |
| 16    | InsDel            | 1=Manual insert, 2=ignore                          |
| 17    | Totalkind         | 1=Group total, 2=Sub total, 4=Grand total          |
| 18    | Group             | 0 or 1 based shot group enum                       |
| 19    | Firekind          | 0=Sighter, 1=Single, 2=Series                      |
| 20    | Logevent          | Incremental log event number                       |
| 21    | Logtype           | 3 types: 3=OwnShot, 10=CrossShot, 12=IllegalShot   |
| 22    | Time              | Since beginning of year in 0.01s                   |
| 23    | Relay             | Relay number                                       |
| 24    | Weapon            | 0=Weapon type (1-21)                               |
| 25    | Position          | 0=Prone, 2=Standing, 3=Kneeling, 4=Prone supported |
| 26    | TargetID          | Target identifier from config                      |
| 27    | External number   | External ID to identify shooter                    |
