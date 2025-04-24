import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRocket, FaUsers, FaLightbulb } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { SignUpModal } from "./auth/AuthModals";

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Mouse tracking for subtle effects
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
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex flex-col px-4 sm:px-6 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800"
    >
      {/* Refined background elements */}
      <div className="absolute inset-0 z-0">
        {/* More subtle grid pattern */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{ y: backgroundY }}
        ></motion.div>

        {/* Refined noise texture */}
        <div className="absolute inset-0 noise-texture opacity-[0.02]"></div>

        {/* More subtle glow effects */}
        <div className="absolute top-1/4 -left-1/4 w-[70vw] h-[60vh] rounded-full bg-blue-600/5 blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vh] rounded-full bg-indigo-600/5 blur-[130px]"></div>

        {/* Subtle mouse-following effect */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.035] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
            x: useTransform(() => mousePosition.x * window.innerWidth - 250),
            y: useTransform(() => mousePosition.y * window.innerHeight - 250),
          }}
          transition={{ type: "spring", stiffness: 75, damping: 25 }}
        />
      </div>

      {/* Hero content with improved layout */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 max-w-6xl mx-auto w-full flex flex-col justify-center min-h-[calc(100vh-80px)] py-16 md:py-20"
      >
        {/* Improved Tagline Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <span className="inline-block text-blue-400 font-medium text-sm md:text-base mb-4 tracking-wider uppercase">
                Environmental Action Platform
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                Turn Your Passion Into
                <div className="mt-3">
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-[size:200%_200%] animate-gradient">
                    Meaningful Change
                  </span>
                </div>
              </h1>
            </motion.div>

            <motion.p
              className="mt-6 md:mt-8 max-w-2xl mx-auto text-base md:text-lg text-slate-300/90 leading-relaxed px-4 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              ActionConnect brings together resources, people, and causes to create measurable environmental impact
              through focused community action and data-driven initiatives.
            </motion.p>

            {/* Updated CTA buttons */}
            <motion.div
              className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.button
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/30"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">{isAuthenticated ? "Find Your Passion →" : "Get Started Now →"}</span>
              </motion.button>

              <Link to="/learn-more">
                <motion.button
                  className="w-full sm:w-auto mt-3 sm:mt-0 bg-transparent border border-slate-700 hover:border-slate-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base font-medium rounded-lg hover:bg-white/5 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Learn More</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Refined Stats Section */}
        <div className="mt-12 md:mt-16 w-full">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 w-full max-w-5xl mx-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {[
              { icon: FaUsers, value: "10k+", label: "Active Community Members", color: "blue" },
              { icon: FaRocket, value: "500+", label: "Environmental Actions", color: "indigo" },
              { icon: FaLightbulb, value: "95%", label: "Success Rate", color: "blue" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden flex flex-col items-center p-6 sm:p-7 bg-white/[0.03] rounded-lg backdrop-blur-[2px] border border-white/[0.05] group"
                whileHover={{
                  y: -4,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.15, duration: 0.6 }}
              >
                {/* Subtle shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  style={{ skewX: "-20deg" }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 2,
                  }}
                />

                {/* Refined icon */}
                <div className={`text-${stat.color}-400 text-2xl md:text-3xl mb-4`}>
                  <stat.icon />
                </div>

                {/* Improved stat display */}
                <span className={`font-semibold text-xl md:text-2xl text-white mb-1`}>{stat.value}</span>
                <span className="text-slate-300/80 text-sm md:text-base text-center">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [0.7, 0]) }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-9 border-2 border-white/20 rounded-full flex justify-center items-start p-1"
          >
            <motion.div
              animate={{ height: ["20%", "60%", "20%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 bg-blue-400/50 rounded-full"
            />
          </motion.div>
          <span className="mt-2 text-xs text-slate-400/70">Scroll to explore</span>
        </motion.div>
      </motion.div>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
