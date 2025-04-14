import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaLightbulb } from "react-icons/fa";
import { useState, useEffect } from "react";
import { SignUpModal } from "./auth/AuthModals";

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for authentication on component mount and when token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Check immediately on component mount
    checkAuth();

    // Setup event listener for storage changes
    window.addEventListener("storage", checkAuth);

    // Cleanup
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/passion"); // Direct to Find Your Passion quiz
    } else {
      setShowSignUp(true); // Show signup modal for non-authenticated users
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col px-4 sm:px-6 md:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/10 to-transparent animate-pulse" />
      </div>

      {/* Hero content with better vertical spacing */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-80px)] py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Tagline Section with improved vertical centering */}
        <div className="flex-1 flex items-center justify-center my-8 md:my-12">
          <div className="text-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Turn Your Passion Into
              <motion.div
                className="mt-2 md:mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="relative inline-block">
                  <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-blue-600/30 to-purple-600/30"></span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient">
                    Meaningful Change
                  </span>
                </span>
              </motion.div>
            </motion.h1>

            <motion.p
              className="mt-6 md:mt-8 max-w-xl mx-auto text-base md:text-lg text-slate-400 leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              ActionConnect helps you discover social causes, connect with like-minded individuals and provides
              resources to take meaningful action.
            </motion.p>
          </div>
        </div>

        {/* Bottom sections with improved spacing */}
        <div className="space-y-12 md:space-y-16 mt-auto md:mb-12">
          {/* Buttons Section with better responsive spacing */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? "Find Your Passion →" : "Get Started Now →"}
            </motion.button>
            <Link to="/learn-more">
              <motion.button
                className="w-full sm:w-auto mt-3 sm:mt-0 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl hover:bg-white/20 transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Section with improved spacing and sizing */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full max-w-4xl mx-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <FaUsers className="text-3xl md:text-4xl text-blue-400 mb-3 md:mb-4" />
              <span className="font-bold text-2xl md:text-3xl text-blue-400 mb-1 md:mb-2">10k+</span>
              <span className="text-slate-300 text-sm md:text-base text-center">Causes Discovered</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <FaRocket className="text-3xl md:text-4xl text-purple-400 mb-3 md:mb-4" />
              <span className="font-bold text-2xl md:text-3xl text-purple-400 mb-1 md:mb-2">500+</span>
              <span className="text-slate-300 text-sm md:text-base text-center">Actions Taken</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <FaLightbulb className="text-3xl md:text-4xl text-pink-400 mb-3 md:mb-4" />
              <span className="font-bold text-2xl md:text-3xl text-pink-400 mb-1 md:mb-2">95%</span>
              <span className="text-slate-300 text-sm md:text-base text-center">Success Rate</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
