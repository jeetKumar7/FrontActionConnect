import React from "react";
import { FaLeaf, FaArrowRight, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WelcomeModal = ({ isOpen, onSignUp, onSignIn, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Video background */}
        <div className="relative overflow-hidden h-60">
          <video className="absolute inset-0 w-full h-full object-cover opacity-50" autoPlay loop muted playsInline>
            <source
              src="https://res.cloudinary.com/dak1w5wyf/video/upload/v1745844567/852435-hd_1920_1080_30fps_knq30q.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>

          {/* Logo and intro text positioned over video */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-cyan-600 p-3 rounded-lg shadow-lg mb-4">
              <FaLeaf className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome to ActionConnect</h1>
            <p className="text-white/80 text-center max-w-md px-4">
              Discover causes that match your values and connect with a community making real change
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-white text-center">Get started in just 2 steps:</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold mr-2">
                    1
                  </span>
                  <h3 className="font-medium text-white">Create Your Account</h3>
                </div>
                <p className="text-white/70 text-sm">
                  Join our community and start tracking the causes you care about.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold mr-2">
                    2
                  </span>
                  <h3 className="font-medium text-white">Find Your Passion</h3>
                </div>
                <p className="text-white/70 text-sm">
                  Take our quiz to discover causes that match your values and interests.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <motion.button
                onClick={onSignUp}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium text-white flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserPlus />
                Create Account
              </motion.button>

              <motion.button
                onClick={onSignIn}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg font-medium text-white flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignInAlt />
                Sign In
              </motion.button>
            </div>

            <button onClick={onClose} className="text-white/60 hover:text-white text-sm text-center mt-4">
              Continue Exploring
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeModal;
