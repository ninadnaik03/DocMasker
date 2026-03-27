
from pdf2image import convert_from_bytes
from PIL import Image
import io
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
def extract_text_and_boxes(file_bytes):
    try:
        images = convert_from_bytes(file_bytes)
    except:
        images = [Image.open(io.BytesIO(file_bytes)).convert("RGB")]

    image = images[0]

    data = pytesseract.image_to_data(
        image, output_type=pytesseract.Output.DICT
    )

    words = []
    boxes = []

    for i in range(len(data["text"])):
        text = data["text"][i].strip()
        if text:
            words.append(text)

            x = data["left"][i]
            y = data["top"][i]
            w = data["width"][i]
            h = data["height"][i]

            boxes.append([x, y, x + w, y + h])

    return image, words, boxes