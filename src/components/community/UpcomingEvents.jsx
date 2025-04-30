import React from "react";
import { FaCalendarPlus, FaCalendarAlt } from "react-icons/fa";

const UpcomingEvents = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] pt-8 pb-8">
      <div className="max-w-7xl mx-auto bg-slate-800/50 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
        <div className="text-center py-16">
          <FaCalendarAlt className="text-6xl mx-auto mb-6 text-[var(--text-primary)]/20" />
          <h2 className="text-2xl font-semibold mb-4">Community Events Coming Soon</h2>
          <p className="text-[var(--text-primary)]/60 max-w-md mx-auto mb-8">
            We're working on adding community events to help you connect with like-minded individuals and participate in
            environmental initiatives.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center gap-2 mx-auto">
            <FaCalendarPlus />
            Get Notified When Events Launch
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
