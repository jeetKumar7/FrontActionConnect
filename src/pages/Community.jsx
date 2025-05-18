import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { FaRss, FaHashtag, FaRegCalendarCheck } from "react-icons/fa";
import CommunityFeed from "../components/community/CommunityFeed";
import ChatChannels from "../components/community/ChatChannels";
import UpcomingEvents from "../components/community/UpcomingEvents";

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

const Community = () => {
  const location = useLocation();
  const isDarkMode = useThemeDetection();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-b from-white to-slate-100 text-slate-800"
      }`}
    >
      {/* Page Header */}
      <div className={`pt-18 pb-4 border-b ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">Community Hub</h1>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              to="/community/feed"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("feed")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : isDarkMode
                  ? "text-white/60 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <FaRss className="w-4 h-4" />
              <span className="text-sm sm:text-base">Feed</span>
            </Link>
            <Link
              to="/community/channels"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("channels")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : isDarkMode
                  ? "text-white/60 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <FaHashtag className="w-4 h-4" />
              <span className="text-sm sm:text-base">Channels</span>
            </Link>
            <Link
              to="/community/events"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("events")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : isDarkMode
                  ? "text-white/60 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <FaRegCalendarCheck className="w-4 h-4" />
              <span className="text-sm sm:text-base">Events</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/community/feed" replace />} />
          <Route path="feed" element={<CommunityFeed />} />
          <Route path="channels" element={<ChatChannels />} />
          <Route path="events" element={<UpcomingEvents />} />
        </Routes>
      </div>
    </div>
  );
};

export default Community;
