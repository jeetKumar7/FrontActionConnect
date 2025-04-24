import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children, title }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal container */}
          <motion.div
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60 w-full max-w-md bg-slate-800 rounded-2xl border border-white/10 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 id="modal-title" className="text-xl font-semibold text-white">
                {title}
              </h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            <div id="modal-description" className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
