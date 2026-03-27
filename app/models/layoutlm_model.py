import torch
from transformers import LayoutLMv3Processor, LayoutLMv3ForTokenClassification
from app.core.config import settings

MODEL_NAME = "microsoft/layoutlmv3-base"
processor = LayoutLMv3Processor.from_pretrained(
    MODEL_NAME,
    apply_ocr=False
)
model = LayoutLMv3ForTokenClassification.from_pretrained(MODEL_NAME)

model.to(settings.DEVICE)
model.eval()

id2label = {0:"O",1:"VENDOR",2:"AMOUNT",3:"DATE"}