import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaTimes, FaMapPin, FaUsers, FaHandshake } from "react-icons/fa";

const LocationPrompt = ({ isDarkMode, onClose, onNavigateToEdit }) => {
  return (
    <motion.div
      className={`${
        isDarkMode ? "bg-slate-800 border-white/10" : "bg-white border-slate-200"
      } rounded-xl border p-6 mb-6 relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
        <FaTimes />
      </button>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className={`p-4 rounded-full ${isDarkMode ? "bg-cyan-600/20" : "bg-cyan-100"} flex-shrink-0`}>
          <FaMapMarkerAlt className={`text-4xl ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">One more step: Add your location</h3>
          <p className={`${isDarkMode ? "text-white/70" : "text-slate-600"} mb-4`}>
            Now that you've discovered causes that match your values, adding your location will help you connect with
            local initiatives and like-minded people in your area.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`${isDarkMode ? "bg-white/5" : "bg-slate-50"} p-3 rounded-lg flex items-start gap-3`}>
              <FaMapPin className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
              <span className="text-sm">Find local initiatives on our interactive map</span>
            </div>
            <div className={`${isDarkMode ? "bg-white/5" : "bg-slate-50"} p-3 rounded-lg flex items-start gap-3`}>
              <FaUsers className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
              <span className="text-sm">Connect with nearby community members</span>
            </div>
            <div className={`${isDarkMode ? "bg-white/5" : "bg-slate-50"} p-3 rounded-lg flex items-start gap-3`}>
              <FaHandshake className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
              <span className="text-sm">Get personalized local action opportunities</span>
            </div>
          </div>

          <motion.button
            onClick={onNavigateToEdit}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaMapMarkerAlt />
            Add Your Location
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationPrompt;
