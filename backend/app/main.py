import uvicorn
from app.api.v1 import athlete, import_file, login, shot
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI()

# Allow all CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(import_file.router, prefix="/api/v1/import", tags=["Import"])
app.include_router(login.router, prefix="/api/v1", tags=["login"])
app.include_router(athlete.router, prefix="/api/v1/athlete", tags=["Athletes"])
app.include_router(shot.router, prefix="/api/v1/shots", tags=["Shots"])

handler = Mangum(app)
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
