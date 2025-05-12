import React, { useState, useEffect } from "react";
import { FaCalendarPlus, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

// Add theme detection hook
const useThemeDetection = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initial theme check
    const isLightMode = document.body.classList.contains("light");
    setIsDarkMode(!isLightMode);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(!document.body.classList.contains("light"));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};

const UpcomingEvents = () => {
  const isDarkMode = useThemeDetection();

  return (
    <div className="min-h-[calc(100vh-8rem)] pt-8 pb-8 px-4">
      <div
        className={`max-w-7xl mx-auto ${
          isDarkMode ? "bg-slate-800/50 border-white/10" : "bg-white/90 border-slate-200"
        } rounded-2xl border p-8 backdrop-blur-sm`}
      >
        <div className="text-center py-16">
          <FaCalendarAlt className={`text-6xl mx-auto mb-6 ${isDarkMode ? "text-white/20" : "text-slate-300"}`} />
          <h2 className="text-2xl font-semibold mb-4">Community Events Coming Soon</h2>
          <p className={`${isDarkMode ? "text-white/60" : "text-slate-600"} max-w-md mx-auto mb-8`}>
            We're working on adding community events to help you connect with like-minded individuals and participate in
            environmental initiatives.
          </p>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCalendarPlus />
            Get Notified When Events Launch
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
