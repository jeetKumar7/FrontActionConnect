import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRocket, FaUsers, FaLightbulb } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { SignUpModal } from "./auth/AuthModals";
import InteractiveBackground from "./InteractiveBackground";

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex flex-col px-4 sm:px-6 md:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      <InteractiveBackground />

      {/* Hero content with better vertical spacing */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-80px)] py-16 md:py-24"
        style={{ y, opacity }}
      >
        {/* Tagline Section with improved vertical centering */}
        <div className="flex-1 flex items-center justify-center my-8 md:my-12">
          <div className="text-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Turn Your Passion Into
              <motion.div
                className="mt-2 md:mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              >
                <span className="relative inline-block">
                  <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-blue-600/30 to-purple-600/30"></span>
                  <motion.span 
                    className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                  >
                    Meaningful Change
                  </motion.span>
                </span>
              </motion.div>
            </motion.h1>

            <motion.p
              className="mt-6 md:mt-8 max-w-xl mx-auto text-base md:text-lg text-slate-400 leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
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
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-1 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{isAuthenticated ? "Find Your Passion →" : "Get Started Now →"}</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundSize: "200% 200%",
                  animation: "gradient 3s ease infinite",
                }}
              />
            </motion.button>
            <Link to="/learn-more">
              <motion.button
                className="group relative w-full sm:w-auto mt-3 sm:mt-0 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl hover:bg-white/20 transition-all duration-300 ease-in-out overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Learn More</span>
                <motion.span
                  className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Section with improved spacing and sizing */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full max-w-4xl mx-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            {[
              { icon: FaUsers, value: "10k+", label: "Causes Discovered", color: "blue" },
              { icon: FaRocket, value: "500+", label: "Actions Taken", color: "purple" },
              { icon: FaLightbulb, value: "95%", label: "Success Rate", color: "pink" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: "easeOut" }}
              >
                <stat.icon className={`text-3xl md:text-4xl text-${stat.color}-400 mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <span className={`font-bold text-2xl md:text-3xl text-${stat.color}-400 mb-1 md:mb-2 group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </span>
                <span className="text-slate-300 text-sm md:text-base text-center group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
