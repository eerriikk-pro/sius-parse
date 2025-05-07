from fastapi import APIRouter, File, HTTPException, UploadFile

from app.crud.import_crud import load_csv_file

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
