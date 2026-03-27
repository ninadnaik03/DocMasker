import torch
from app.models.layoutlm_model import load_model, id2label
from app.services.ocr_service import extract_text_and_boxes
from app.services.postprocess_service import finalize
from app.core.config import settings


def normalize(boxes, w, h):
    return [
        [
            int(1000 * x / w),
            int(1000 * y / h),
            int(1000 * x2 / w),
            int(1000 * y2 / h),
        ]
        for x, y, x2, y2 in boxes
    ]


def run_inference(file_bytes):
    processor, model = load_model()

    image, words, boxes = extract_text_and_boxes(file_bytes)

    if not words:
        return {
            "success": True,
            "data": {
                "vendor": "Not found",
                "amount": "Not found",
                "date": "Not found",
                "confidence": 0.0,
            },
        }

    w, h = image.size
    boxes = normalize(boxes, w, h)

    encoding = processor(
        image,
        words,
        boxes=boxes,
        return_tensors="pt",
        padding="max_length",
        truncation=True,
    )
    
    encoding = {k: v.to(settings.DEVICE) for k, v in encoding.items()}

    with torch.no_grad():
        outputs = model(**encoding)

    logits = outputs.logits
    probs = torch.softmax(logits, dim=-1)

    preds = logits.argmax(-1).squeeze().tolist()
    confs = probs.max(-1).values.squeeze().tolist()

    if isinstance(preds, int):
        preds = [preds]
    if isinstance(confs, float):
        confs = [confs]

    v, a, d = [], [], []

    for word, p in zip(words, preds):
        label = id2label.get(p, "O")

        if label == "VENDOR":
            v.append(word)
        elif label == "AMOUNT":
            a.append(word)
        elif label == "DATE":
            d.append(word)

    result = finalize(
        " ".join(v) if v else "",
        " ".join(a) if a else "",
        " ".join(d) if d else "",
    )

    confidence = sum(confs) / len(confs) if confs else 0.0
    result["confidence"] = round(confidence, 2)

    return {
        "success": True,
        "data": result,
    }
