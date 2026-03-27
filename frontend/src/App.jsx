import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Upload from "./components/Upload";
import ResultCard from "./components/ResultCard";
import ImageViewer from "./components/ImageViewer";
import Loader from "./components/Loader";
import { extractDocument } from "./api";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const uploadRef = useRef(null);
  const infoRef = useRef(null);

  /* ✅ Navbar scroll */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ✅ Upload handler */
  const handleUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await extractDocument(file);

      if (!res || res.success === false || !res.data) {
        throw new Error(res?.error || "Invalid response");
      }

      setResult(res);

      setTimeout(() => {
        uploadRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);

    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    }

    setLoading(false);
  };

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInfo = () => {
    infoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      title: "Instant Data Extraction",
      desc: "Extracts key invoice fields like vendor, amount, and date instantly."
    },
    {
      title: "Multimodal AI",
      desc: "Understands both text and layout for better document interpretation."
    },
    {
      title: "Reduced Manual Work",
      desc: "Automates repetitive tasks and reduces human effort."
    },
    {
      title: "Low Data Requirement",
      desc: "Works effectively with minimal labeled data."
    },
    {
      title: "Explainable AI",
      desc: "Visualizes how the model reads documents."
    },
    {
      title: "Fast Processing",
      desc: "Real-time document parsing with optimized pipelines."
    },
    {
      title: "Scalable System",
      desc: "Designed to integrate into real-world workflows."
    },
    {
      title: "Production Ready",
      desc: "Built using modern backend + frontend stack."
    }
  ];

  return (
    <div>
      <Navbar scrolled={scrolled} />

      {/* HERO */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 initial={{ y: 30 }} animate={{ y: 0 }}>
          DocMasker
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Transform documents into structured data using AI
        </motion.p>

        <div className="hero-buttons">
          <motion.button
            className="primary"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToUpload}
          >
            Try the product
          </motion.button>

          <motion.button
            className="secondary"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToInfo}
          >
            Learn more
          </motion.button>
        </div>
      </motion.section>

      {/* UPLOAD */}
      <section ref={uploadRef} className="section">
        <Upload onUpload={handleUpload} />

        {loading && <Loader />}

        {/* RESULTS */}
        {result && (
          <motion.div
            className="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ResultCard data={result.data} />

            <div className="grid">
              {result.boxed_image && (
                <ImageViewer hex={result.boxed_image} />
              )}
              {result.heatmap && (
                <ImageViewer hex={result.heatmap} />
              )}
            </div>
          </motion.div>
        )}
      </section>

      {/* FEATURES — ALWAYS VISIBLE (FIXED) */}
      <motion.section
        ref={infoRef}
        className="section features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="features-header">
          <h2>Built for modern document intelligence</h2>
          <p>
            DocMasker converts raw documents into structured, usable data using AI.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}