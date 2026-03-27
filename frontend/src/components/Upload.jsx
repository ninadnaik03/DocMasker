import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Upload({ onUpload }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  const validateFile = (f) => {
    if (!f) return false;

    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

    if (!allowedTypes.includes(f.type)) {
      alert("Only PNG, JPG, and PDF files are allowed.");
      return false;
    }

    if (f.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      return false;
    }

    return true;
  };

  const handleFile = (f) => {
    if (!validateFile(f)) return;

    setFile(f);
    onUpload(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  return (
    <motion.div
      className={`upload-container ${dragging ? "dragging" : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="file"
        ref={inputRef}
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
        accept=".png,.jpg,.jpeg,.pdf"
      />

      {!file ? (
        <div className="upload-inner">
          <div className="upload-icon" />

          <h2>Upload document</h2>

          <p>Drag and drop your file here or click to browse</p>

          <span className="upload-hint">
            Supported formats: PNG, JPG, PDF (max 5MB)
          </span>
        </div>
      ) : (
        <motion.div
          className="file-preview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="file-info">
            <p className="file-name">{file.name}</p>
            <p className="file-size">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>

          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
          >
            Remove
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}