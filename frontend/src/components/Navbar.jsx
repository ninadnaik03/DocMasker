import { motion } from "framer-motion";

export default function Navbar({ scrolled }) {
  return (
    <motion.div
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      DocMasker
    </motion.div>
  );
}