from pydantic import BaseModel

class ExtractionResponse(BaseModel):
    vendor: str
    amount: str
    date: str
    confidence: float