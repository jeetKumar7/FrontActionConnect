import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaHandsHelping, FaUsers, FaChartLine, FaArrowDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { SignUpModal } from "./auth/AuthModals";

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30]);
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

  // Mouse tracking with improved smoothing
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition((prev) => ({
        x: prev.x + (e.clientX / window.innerWidth - prev.x) * 0.03,
        y: prev.y + (e.clientY / window.innerHeight - prev.y) * 0.03,
      }));
    };

    let animationFrameId;
    const updateMousePosition = () => {
      animationFrameId = requestAnimationFrame(updateMousePosition);
    };
    updateMousePosition();

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/passion");
    } else {
      setShowSignUp(true);
    }
  };

  // Generate random nodes for the network visualization
  const generateNodes = (count) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const distance = 140 + (i % 3) * 40;
      const x = Math.cos(angle) * distance + 250;
      const y = Math.sin(angle) * distance + 250;
      const size = 4 + Math.random() * 4;

      // Assign different colors based on index
      const colors = ["blue", "indigo", "violet", "purple"];
      const colorIndex = i % colors.length;

      return { x, y, size, color: colors[colorIndex], index: i };
    });
  };

  const nodes = generateNodes(12);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80"
    >
      {/* Professional background elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid pattern */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{ y: backgroundY }}
        ></motion.div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]">
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        {/* Gradient accent lights */}
        <div className="absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full bg-violet-900/20 blur-[120px]"></div>

        {/* Responsive glow following cursor */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.07] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.2) 40%, transparent 70%)",
            x: useTransform(() => mousePosition.x * window.innerWidth - 300),
            y: useTransform(() => mousePosition.y * window.innerHeight - 300),
          }}
          transition={{
            type: "spring",
            stiffness: 10,
            damping: 50,
            mass: 3,
          }}
        />
      </div>

      {/* Main content layout */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col lg:flex-row items-center justify-between py-12">
        {/* Left: Content section */}
        <motion.div className="w-full lg:w-1/2 lg:pr-8 mb-10 lg:mb-0 z-10" style={{ y: contentY, opacity }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-lg"
          >
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <span className="text-indigo-300 text-sm font-medium">Social Impact Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Connect, <span className="text-indigo-400">Inspire</span>, and Catalyze Change
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-slate-300/90 leading-relaxed max-w-lg">
              We bring together passionate individuals and diverse social causes, sparking meaningful conversations that
              transform shared vision into measurable societal impact.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <motion.button
                onClick={handleGetStarted}
                className="group relative bg-indigo-600 text-white px-8 py-4 rounded-md font-medium shadow-lg shadow-indigo-900/30 hover:bg-indigo-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  {isAuthenticated ? "Find Your Cause" : "Join The Movement"}
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
                  className="text-white border border-slate-700 hover:border-slate-500 px-8 py-4 rounded-md font-medium transition-all"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>

            {/* Stats section with professional styling */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: FaHandsHelping, value: "10k+", label: "Causes Supported", color: "indigo" },
                { icon: FaUsers, value: "500+", label: "Community Actions", color: "violet" },
                { icon: FaChartLine, value: "95%", label: "Success Rate", color: "purple" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-500/10">
                    <stat.icon className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <span className="block font-bold text-2xl text-white">{stat.value}</span>
                    <span className="block text-sm text-slate-400">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Cause Showcase - completely redesigned */}
        <motion.div className="hidden lg:block w-full lg:w-1/2 lg:pl-8 relative" style={{ y: imageY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative h-[500px] w-full max-w-[500px] mx-auto"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-900/30 via-violet-900/20 to-purple-900/30 backdrop-blur-sm shadow-2xl border border-indigo-500/10 overflow-hidden">
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* Content title */}
              <div className="absolute top-6 left-6 right-6">
                <h3 className="text-xl font-medium text-white/90 mb-1">Impacting Communities Through</h3>
                <div className="h-0.5 w-16 bg-indigo-400/60"></div>
              </div>

              {/* Featured causes showcase */}
              <div className="absolute inset-0 pt-20 px-6 pb-6 overflow-hidden">
                <div className="h-full grid grid-cols-2 gap-4 overflow-y-auto pr-2 causes-scrollbar">
                  {[
                    {
                      title: "Environmental Conservation",
                      color: "from-emerald-500/20 to-teal-600/20",
                      icon: "🌱",
                      count: 1245,
                    },
                    { title: "Education Access", color: "from-blue-500/20 to-indigo-600/20", icon: "📚", count: 834 },
                    { title: "Healthcare Equity", color: "from-red-500/20 to-pink-600/20", icon: "🏥", count: 967 },
                    {
                      title: "Poverty Alleviation",
                      color: "from-amber-500/20 to-orange-600/20",
                      icon: "🏠",
                      count: 1182,
                    },
                    {
                      title: "Clean Water Initiatives",
                      color: "from-cyan-500/20 to-blue-600/20",
                      icon: "💧",
                      count: 756,
                    },
                    { title: "Social Justice", color: "from-purple-500/20 to-violet-600/20", icon: "⚖️", count: 1058 },
                  ].map((cause, index) => (
                    <motion.div
                      key={index}
                      className={`rounded-lg bg-gradient-to-br ${cause.color} backdrop-blur-sm border border-white/5 p-4 flex flex-col hover:border-white/10 transition-all duration-300 relative overflow-hidden group`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.03, y: -3 }}
                    >
                      {/* Background soft gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent"
                        initial={{ opacity: 0.3 }}
                        whileHover={{ opacity: 0.5 }}
                        transition={{ duration: 0.3 }}
                      />

                      <div className="flex justify-between items-start mb-3">
                        <span className="text-2xl">{cause.icon}</span>
                        <span className="text-xs font-medium text-white/70 bg-white/10 px-2 py-1 rounded-full">
                          {cause.count.toLocaleString()} actions
                        </span>
                      </div>

                      <h4 className="text-white text-base font-medium mb-2 mt-1">{cause.title}</h4>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center text-[10px] text-white/80"
                            >
                              {["JD", "TK", "MR"][i]}
                            </div>
                          ))}
                        </div>
                        <motion.div
                          className="text-indigo-300/80 text-xs flex items-center"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          View <FaArrowDown className="rotate-[-90deg] ml-1 text-[10px]" />
                        </motion.div>
                      </div>

                      {/* Animated indicator light */}
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-white/70"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
                          transition={{ duration: 2 + index, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gradient overlays to indicate scrolling */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-indigo-900/80 to-transparent pointer-events-none"></div>
              <div className="absolute top-20 left-0 right-0 h-6 bg-gradient-to-b from-indigo-900/80 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <motion.div
              className="absolute -bottom-10 -left-5 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Professional scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 text-xs text-indigo-300/90 py-2 px-4 rounded-full bg-indigo-900/10 backdrop-blur-sm border border-indigo-500/10 z-50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
      >
        <motion.div
          animate={{
            y: [0, 3, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-indigo-400"
        >
          <FaArrowDown />
        </motion.div>
        <span>Discover Our Impact</span>
      </motion.div>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
