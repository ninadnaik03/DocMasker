from fastapi import APIRouter, UploadFile, File
from app.services.inference_service import run_inference
from app.core.errors import InvalidFileError
from app.core.config import settings

router = APIRouter()


@router.post("/extract")
async def extract(file: UploadFile = File(...)):
    try:
        content = await file.read()

        result = run_inference(content)

        print("DEBUG RESULT:", result)  # 🔥 ADD THIS

        return {
            "success": True,
            "data": result,
            "boxed_image": "",
            "heatmap": ""
        }

    except Exception as e:
        print("ERROR:", e)
        return {"success": False, "error": str(e)}