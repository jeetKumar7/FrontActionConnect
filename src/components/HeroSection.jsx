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

        {/* Right: Network visualization - updated with visible content */}
        <motion.div className="hidden lg:block w-full lg:w-1/2 lg:pl-8 relative" style={{ y: imageY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative h-[500px] w-[500px] mx-auto"
          >
            {/* Enhanced Network visualization */}
            <div className="absolute inset-0 rounded-full border-[12px] border-indigo-500/10 animate-spin-slow"></div>
            <div className="absolute inset-[30px] rounded-full border-[1px] border-indigo-400/20 animate-reverse-spin"></div>

            {/* Fill the blank space with a gradient background */}
            <div className="absolute inset-[60px] rounded-full bg-gradient-to-br from-indigo-600/20 via-violet-500/10 to-purple-800/20 backdrop-blur-sm shadow-2xl">
              {/* Add visible pattern */}
              <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay network-pattern"></div>

              {/* Additional content to ensure visibility */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500/30 to-violet-500/30 flex items-center justify-center">
                  <div className="text-white/50 text-4xl font-light">AC</div>
                </div>
              </div>
            </div>

            {/* Nodes */}
            {nodes.map((node) => (
              <motion.div
                key={node.index}
                className={`absolute w-${Math.floor(node.size)} h-${Math.floor(node.size)} rounded-full bg-${
                  node.color
                }-400`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.size,
                  height: node.size,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
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
              {nodes.map((source, i) => (
                <motion.line
                  key={i}
                  x1={source.x + source.size / 2}
                  y1={source.y + source.size / 2}
                  x2={nodes[(i + 3) % nodes.length].x + nodes[(i + 3) % nodes.length].size / 2}
                  y2={nodes[(i + 3) % nodes.length].y + nodes[(i + 3) % nodes.length].size / 2}
                  stroke={`rgba(120, 120, 255, ${0.1 + Math.random() * 0.1})`}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>
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
