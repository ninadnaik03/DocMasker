import torch
from transformers import AutoProcessor, LayoutLMv3ForTokenClassification
from app.core.config import settings

MODEL_NAME = "microsoft/layoutlmv3-base"

processor = None
model = None

def load_model():
    global processor, model

    if processor is None:
        processor = AutoProcessor.from_pretrained(
            MODEL_NAME,
            apply_ocr=False
        )

    if model is None:
        model = LayoutLMv3ForTokenClassification.from_pretrained(MODEL_NAME)
        model.to(settings.DEVICE)
        model.eval()

    return processor, model


id2label = {
    0: "O",
    1: "VENDOR",
    2: "AMOUNT",
    3: "DATE"
}
