import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children, title, isDarkMode = true }) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Modal container */}
        <motion.div
          className={`relative w-full max-w-md ${
            isDarkMode ? "bg-slate-800 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
          } rounded-2xl border shadow-xl`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div
            className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? "border-white/10" : "border-slate-200"
            }`}
          >
            <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{title}</h2>
            <button
              onClick={onClose}
              className={`${
                isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              } transition-colors`}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById("root")
  );
};

export default Modal;
