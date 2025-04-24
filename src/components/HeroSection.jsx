import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaLeaf, FaHandsHelping, FaChartLine } from "react-icons/fa";
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

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -20]);

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

  // Mouse tracking
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
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950"
    >
      {/* Nature-inspired background elements */}
      <div className="absolute inset-0 z-0">
        {/* Organic patterns */}
        <svg className="absolute opacity-5 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M20,20 Q40,5 60,20 T100,20 Q120,5 140,20 T180,20" stroke="white" fill="none" strokeWidth="1" />
              <path d="M20,50 Q40,35 60,50 T100,50 Q120,35 140,50 T180,50" stroke="white" fill="none" strokeWidth="1" />
              <path d="M20,80 Q40,65 60,80 T100,80 Q120,65 140,80 T180,80" stroke="white" fill="none" strokeWidth="1" />
              <path
                d="M20,110 Q40,95 60,110 T100,110 Q120,95 140,110 T180,110"
                stroke="white"
                fill="none"
                strokeWidth="1"
              />
              <path
                d="M20,140 Q40,125 60,140 T100,140 Q120,125 140,140 T180,140"
                stroke="white"
                fill="none"
                strokeWidth="1"
              />
              <path
                d="M20,170 Q40,155 60,170 T100,170 Q120,155 140,170 T180,170"
                stroke="white"
                fill="none"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#leaf-pattern)" />
        </svg>

        {/* Dynamic lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[180px] opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(74, 222, 128, 0.4) 0%, rgba(5, 150, 105, 0.2) 40%, transparent 70%)",
            x: useTransform(() => mousePosition.x * window.innerWidth - 400),
            y: useTransform(() => mousePosition.y * window.innerHeight - 400),
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
        />
      </div>

      {/* Content with asymmetric layout */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col lg:flex-row items-center justify-between py-12">
        {/* Left: Main content */}
        <motion.div className="w-full lg:w-1/2 lg:pr-8 mb-10 lg:mb-0 z-10" style={{ y: contentY }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-green-400/10 border border-green-400/20 mb-6">
              <span className="text-green-300 text-sm font-medium">Our Environmental Mission</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Connect, <span className="text-green-300">Inspire</span>, and Catalyze Meaningful Change
            </h1>

            <p className="mt-6 text-lg text-gray-200/90 leading-relaxed max-w-lg">
              We bring together passionate individuals, actionable ideas, and sustainable solutions that deepen
              environmental awareness and transform shared vision into collective impact.
            </p>

            {/* CTA buttons with new design */}
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <motion.button
                onClick={handleGetStarted}
                className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-md font-medium shadow-xl shadow-green-900/30 hover:shadow-green-600/20 overflow-hidden"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(4, 120, 87, 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">
                  {isAuthenticated ? "Find Your Passion" : "Join The Movement"}
                  <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ x: "100%", opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <Link to="/learn-more">
                <motion.button
                  className="text-white border border-white/20 hover:border-white/40 px-8 py-4 rounded-md font-medium transition-all"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>

            {/* Stats with new design */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: FaLeaf, value: "10k+", label: "Trees Planted", color: "green" },
                { icon: FaHandsHelping, value: "500+", label: "Community Actions", color: "emerald" },
                { icon: FaChartLine, value: "95%", label: "Success Rate", color: "teal" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-500/20`}>
                    <stat.icon className={`text-${stat.color}-400 text-xl`} />
                  </div>
                  <div>
                    <span className="block font-bold text-2xl text-white">{stat.value}</span>
                    <span className="block text-sm text-gray-300/80">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Visual element */}
        <motion.div className="hidden lg:block w-full lg:w-1/2 lg:pl-8 relative" style={{ y: imageY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative h-[500px] w-[500px] mx-auto"
          >
            {/* Earth visualization */}
            <div className="absolute inset-0 rounded-full border-[15px] border-green-500/10 animate-spin-slow"></div>

            <div className="absolute inset-[40px] rounded-full border-[2px] border-green-400/20 animate-reverse-spin"></div>

            <div className="absolute inset-[80px] rounded-full bg-gradient-to-br from-emerald-600/40 via-teal-500/20 to-green-800/30 backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 bg-[url('../public/earth_texture.png')] bg-cover opacity-20 mix-blend-overlay rounded-full"></div>
            </div>

            {/* Floating elements */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-green-300"
                style={{
                  left: `${25 + Math.random() * 50}%`,
                  top: `${25 + Math.random() * 50}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="50%" y1="0%" x2="80%" y2="30%" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="1" />
              <line x1="90%" y1="50%" x2="30%" y2="80%" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="1" />
              <line x1="20%" y1="40%" x2="70%" y2="70%" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="1" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating message */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-gray-300/70 py-2 px-4 rounded-full bg-white/5 backdrop-blur-sm z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-green-400"
        >
          ↓
        </motion.div>
        <span>Scroll to discover how we make a difference</span>
      </motion.div>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
