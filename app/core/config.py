import os

class Settings:
    MODEL_PATH = os.getenv("MODEL_PATH", "saved_model")
    DEVICE = os.getenv("DEVICE", "cpu")
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

settings = Settings()