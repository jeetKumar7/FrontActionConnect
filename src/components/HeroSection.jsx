import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaLightbulb } from "react-icons/fa";
import { useState, useEffect } from "react";
import { SignUpModal } from "./auth/AuthModals";

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Check for authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/passion");
    } else {
      setShowSignUp(true);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col px-4 sm:px-6 md:px-8 animated-gradient">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        {/* Noise texture */}
        <div className="absolute inset-0 noise-texture opacity-[0.03]"></div>

        {/* Animated glow */}
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-slower"></div>

        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
            transform: `translate(${mousePosition.x * window.innerWidth - 300}px, ${
              mousePosition.y * window.innerHeight - 300
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[calc(100vh-80px)] py-16 md:py-24">
        {/* Tagline Section */}
        <div className="flex-1 flex items-center justify-center my-8 md:my-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                Turn Your Passion Into
                <div className="mt-2 md:mt-4">
                  <motion.div
                    className="relative inline-block"
                    animate={{
                      filter: [
                        "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
                        "drop-shadow(0 0 25px rgba(168, 85, 247, 0.4))",
                        "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span
                      className="absolute -inset-1 rounded-lg blur-2xl bg-gradient-to-r from-blue-600/30 to-purple-600/30"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
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
                  </motion.div>
                </div>
              </h1>
            </motion.div>

            <motion.p
              className="mt-6 md:mt-8 max-w-xl mx-auto text-base md:text-lg text-slate-300 leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              ActionConnect helps you discover social causes, connect with like-minded individuals and provides
              resources to take meaningful action.
            </motion.p>
          </div>
        </div>

        {/* Bottom sections */}
        <div className="space-y-12 md:space-y-16 mt-auto md:mb-12">
          {/* Buttons Section */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-purple-500/30 overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 30px -10px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                animate={{
                  x: ["-100%", "100%"],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              />
              <span className="relative z-10">{isAuthenticated ? "Find Your Passion →" : "Get Started Now →"}</span>
            </motion.button>

            <Link to="/learn-more">
              <motion.button
                className="group relative w-full sm:w-auto mt-3 sm:mt-0 bg-white/5 backdrop-blur-sm text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Learn More</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full max-w-4xl mx-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.8,
              staggerChildren: 0.1,
            }}
          >
            {[
              { icon: FaUsers, value: "10k+", label: "Causes Discovered", color: "blue" },
              { icon: FaRocket, value: "500+", label: "Actions Taken", color: "purple" },
              { icon: FaLightbulb, value: "95%", label: "Success Rate", color: "pink" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden flex flex-col items-center p-5 sm:p-6 md:p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 group"
                whileHover={{
                  y: -5,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  transition: { duration: 0.3 },
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.15, duration: 0.6 }}
              >
                {/* Shimmering effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  style={{ skewX: "-20deg" }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1,
                    delay: index * 0.5,
                  }}
                />

                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <stat.icon className={`text-3xl md:text-4xl text-${stat.color}-400 mb-3 md:mb-4`} />
                </motion.div>

                <span className={`font-bold text-2xl md:text-3xl text-${stat.color}-400 mb-1 md:mb-2`}>
                  {stat.value}
                </span>
                <span className="text-slate-300 text-sm md:text-base text-center group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
