import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaUsers, FaRocket, FaGraduationCap, FaHandsHelping, FaGlobe } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SignUpModal } from "../components/auth/AuthModals";

const features = [
  {
    icon: FaLeaf,
    title: "Environmental Impact",
    description: "Join initiatives focused on sustainability, conservation, and climate action.",
  },
  {
    icon: FaUsers,
    title: "Community Building",
    description: "Connect with like-minded individuals and organizations in your area.",
  },
  {
    icon: FaRocket,
    title: "Project Launch",
    description: "Get resources and support to launch your own environmental initiatives.",
  },
  {
    icon: FaGraduationCap,
    title: "Educational Resources",
    description: "Access guides, workshops, and training materials to enhance your impact.",
  },
  {
    icon: FaHandsHelping,
    title: "Volunteer Opportunities",
    description: "Find and participate in local environmental projects and events.",
  },
  {
    icon: FaGlobe,
    title: "Global Network",
    description: "Be part of a worldwide movement for environmental change.",
  },
];

// Theme detection hook
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

export default function LearnMore() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const isDarkMode = useThemeDetection();

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleJoinClick = () => {
    if (isAuthenticated) {
      // If user is already logged in, navigate to community or dashboard
      navigate("/community");
    } else {
      // If not logged in, show the signup modal
      setShowSignUp(true);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gradient-to-b from-slate-900 to-slate-800" : "bg-gradient-to-b from-slate-50 to-white"
      } text-[var(--text-primary)] pt-20 -mt-7`}
    >
      {/* Hero Section */}
      <div
        className={`relative ${
          isDarkMode ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-400 to-purple-400"
        } py-16`}
      >
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)]"
              : "bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]"
          } bg-[size:14px_24px]`}
        />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About ActionConnect
          </motion.h1>
          <motion.p
            className="text-xl text-center text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Empowering individuals to create meaningful environmental change through community action and resources.
          </motion.p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
              } backdrop-blur-sm rounded-xl p-6 border`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <feature.icon className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-500"} mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={`${isDarkMode ? "text-white/60" : "text-slate-600"}`}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <motion.div
          className={`${
            isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-md"
          } backdrop-blur-sm rounded-xl p-8 border`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className={`${isDarkMode ? "text-white/60" : "text-slate-600"} mb-8 max-w-2xl mx-auto`}>
            Join our community of changemakers and start contributing to environmental causes that matter.
          </p>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium text-white hover:from-blue-600 hover:to-purple-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinClick}
          >
            {isAuthenticated ? "Go to Community →" : "Join ActionConnect →"}
          </motion.button>
        </motion.div>
      </div>

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          // If you need to show sign in modal instead, you would handle that here
        }}
      />
    </div>
  );
}
