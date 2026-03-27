import axios from "axios";

const API = "https://docmasker-backend.onrender.com/extract;

export const extractDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:8000/extract",
    formData
  );

  return response.data;  // 🔥 THIS LINE IS CRITICAL
};
