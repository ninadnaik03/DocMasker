import torch
from app.models.layoutlm_model import processor, model, id2label
from app.services.ocr_service import extract_text_and_boxes
from app.services.postprocess_service import finalize

def normalize(boxes, w, h):
    return [[int(1000*x/w), int(1000*y/h), int(1000*x2/w), int(1000*y2/h)] for x,y,x2,y2 in boxes]

def run_inference(file_bytes):
    image, words, boxes = extract_text_and_boxes(file_bytes)

    if not words:
        return {
            "vendor": "N/A",
            "amount": "N/A",
            "date": "N/A",
            "confidence": 0.0
        }

    w,h = image.size
    boxes = normalize(boxes, w, h)

    encoding = processor(
        image,
        words,
        boxes=boxes,
        return_tensors="pt",
        padding="max_length",
        truncation=True
    )

    with torch.no_grad():
        outputs = model(**encoding)

    logits = outputs.logits
    probs = torch.softmax(logits, dim=-1)

    preds = logits.argmax(-1).squeeze().tolist()
    confs = probs.max(-1).values.squeeze().tolist()

    v,a,d = [],[],[]
    for word,p in zip(words,preds):
        label = id2label.get(p,"O")
        if label=="VENDOR": v.append(word)
        if label=="AMOUNT": a.append(word)
        if label=="DATE": d.append(word)

    result = finalize(" ".join(v), " ".join(a), " ".join(d))
    result["confidence"] = round(sum(confs)/len(confs),2)

    return result