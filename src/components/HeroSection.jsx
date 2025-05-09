import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  FaHandsHelping,
  FaUsers,
  FaChartLine,
  FaArrowDown,
  FaMapMarkerAlt,
  FaComments,
  FaLightbulb,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { SignUpModal } from "./auth/AuthModals";

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -15]);

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

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

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/passion");
    } else {
      setShowSignUp(true);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cyan-950 via-slate-900 to-fuchsia-900/70 pt-16"
    >
      {/* Background video section with improved visibility */}
      <div className="absolute inset-0 top-16 z-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!isMobile && (
            <video
              className="absolute w-full h-full object-cover opacity-100" // Increased opacity to 100%
              autoPlay
              muted
              loop
              playsInline
              poster="https://res.cloudinary.com/dak1w5wyf/video/upload/q_auto,f_auto,c_fill,g_auto,w_1200/v1/actionconnect/backgrounds/actionbg_1.jpg"
            >
              <source
                src="https://res.cloudinary.com/dak1w5wyf/video/upload/v1745571673/bg_video_2_otrmck.mp4"
                type="video/mp4"
              />
            </video>
          )}
          {/* Lighter black overlay for better video visibility */}
          <div className="absolute inset-0 bg-black/40"></div> {/* Reduced opacity from 50% to 40% */}
        </div>

        {/* Keep noise texture */}
        <div className="absolute inset-0 opacity-[0.01] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]">
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        {/* Softer accent lights with reduced intensity */}
        <div className="absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full bg-cyan-600/20 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full bg-amber-500/10 blur-[120px]"></div>
        <div className="absolute right-1/3 top-1/3 w-1/3 aspect-square rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      {/* Main content layout stays the same */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col lg:flex-row items-center justify-between pt-4 pb-12">
        {/* Left side content */}
        <motion.div className="w-full lg:w-1/2 lg:pr-8 mb-10 lg:mb-0 z-10" style={{ y: contentY, opacity }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-lg"
          >
            {/* Updated heading with gradient text */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
              Connect,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Inspire</span>,
              and Catalyze Change
            </h1>

            {/* Description stays the same */}
            <p className="mt-6 text-lg text-slate-300/90 leading-relaxed max-w-lg">
              We bring together passionate individuals and diverse social causes, sparking meaningful conversations that
              transform shared vision into measurable societal impact.
            </p>

            {/* Updated CTA buttons */}
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <motion.button
                onClick={handleGetStarted}
                className="group relative bg-gradient-to-r from-cyan-600 to-teal-600 text-[var(--text-primary)] px-8 py-4 rounded-md font-medium shadow-lg shadow-cyan-700/20 hover:from-cyan-500 hover:to-teal-500 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  {isAuthenticated ? "Find Your Passion" : "Get Started"}
                  <motion.span
                    className="ml-1.5 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              <Link to="/learn-more">
                <motion.button
                  className="text-[var(--text-primary)] border border-teal-700/30 hover:border-teal-600/60 px-8 py-4 rounded-md font-medium transition-all"
                  whileHover={{ backgroundColor: "rgba(20, 184, 166, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>

            {/* Updated stats section with varied colors */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  icon: FaHandsHelping,
                  value: "10k+",
                  label: "Causes Supported",
                  bgColor: "bg-cyan-500/10",
                  iconColor: "text-cyan-400",
                },
                {
                  icon: FaUsers,
                  value: "500+",
                  label: "Community Actions",
                  bgColor: "bg-amber-500/10",
                  iconColor: "text-amber-400",
                },
                {
                  icon: FaChartLine,
                  value: "95%",
                  label: "Success Rate",
                  bgColor: "bg-emerald-500/10",
                  iconColor: "text-emerald-400",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                    <stat.icon className={`${stat.iconColor} text-xl`} />
                  </div>
                  <div>
                    <span className="block font-bold text-2xl text-[var(--text-primary)]">{stat.value}</span>
                    <span className="block text-sm text-slate-300">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
