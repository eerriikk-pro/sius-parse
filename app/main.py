import uvicorn
from fastapi import FastAPI

from app.api.v1 import athlete, import_file, login

app = FastAPI()

app.include_router(import_file.router, prefix="/api/v1/import", tags=["Import"])
app.include_router(login.router, prefix="/api/v1", tags=["login"])
app.include_router(athlete.router, prefix="/api/v1/athlete", tags=["Athletes"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
