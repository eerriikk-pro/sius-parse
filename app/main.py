import uvicorn
from fastapi import FastAPI

from app.api.v1 import import_file

app = FastAPI()

app.include_router(import_file.router, prefix="/api/v1/import", tags=["Import"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
