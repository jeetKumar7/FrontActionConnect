import React from "react";
import { Link, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { FaRss, FaHashtag, FaRegCalendarCheck, FaEnvelope } from "react-icons/fa";
import CommunityFeed from "../components/community/CommunityFeed";
import ChatChannels from "../components/community/ChatChannels";

import UpcomingEvents from "../components/community/UpcomingEvents";

const Community = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Page Header */}
      <div className="pt-20 pb-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Community Hub</h1>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
            <Link
              to="/community/feed"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isActive("feed")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaRss className="w-4 h-4" />
              <span>Community Feed</span>
            </Link>
            <Link
              to="/community/channels"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isActive("channels")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaHashtag className="w-4 h-4" />
              <span>Chat Channels</span>
            </Link>

            <Link
              to="/community/events"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isActive("events")
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaRegCalendarCheck className="w-4 h-4" />
              <span>Upcoming Events</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
