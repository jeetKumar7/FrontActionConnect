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

export default function LearnMore() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-[var(--text-primary)] pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About ActionConnect
          </motion.h1>
          <motion.p
            className="text-xl text-center text-[var(--text-primary)]/80 max-w-3xl mx-auto"
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
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--text-primary)]/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-[var(--text-primary)]/60 mb-8 max-w-2xl mx-auto">
            Join our community of changemakers and start contributing to environmental causes that matter.
          </p>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600"
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
