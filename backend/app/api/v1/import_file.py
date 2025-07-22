from typing import List

from app.crud.import_crud import load_csv_file
from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    try:
        await load_csv_file(file)
        return {"message": "Upload successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/csv/multi")
async def upload_csv_multi(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        if not file.filename.endswith(".csv"):
            results.append(
                {
                    "filename": file.filename,
                    "status": "error",
                    "detail": "Only CSV files are allowed",
                }
            )
            continue
        try:
            await load_csv_file(file)
            results.append({"filename": file.filename, "status": "success"})
        except Exception as e:
            results.append(
                {"filename": file.filename, "status": "error", "detail": str(e)}
            )
    return {"results": results}
