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
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80"
    >
      {/* Professional background elements */}
      <div className="absolute inset-0 z-0">
        {/* Background video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!isMobile && (
            <video className="absolute w-full h-full object-cover opacity-90" autoPlay muted loop playsInline>
              <source src="/actionbg.mp4" type="video/mp4" />
            </video>
          )}
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/80 to-indigo-950/80"></div>
        </div>

        {/* Grid pattern - keep existing elements */}
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

        {/* Right: Interactive Feature Showcase */}
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

              {/* Feature showcase header */}
              <div className="absolute top-0 left-0 right-0 px-6 py-4 bg-gradient-to-b from-indigo-900/80 to-transparent z-10">
                <h3 className="text-xl font-medium text-white/90">Platform Features</h3>
                <div className="h-0.5 w-16 bg-indigo-400/60 mt-1"></div>
              </div>

              {/* Interactive feature showcase component */}
              <div className="absolute inset-0 pt-16 px-6 pb-16">
                <FeatureShowcase />
              </div>
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

// Interactive Feature Showcase Component
const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "map",
      title: "Interactive Map",
      description:
        "Discover local initiatives and connect with like-minded individuals in your area working on environmental and social causes.",
      icon: FaMapMarkerAlt,
      color: "from-blue-600 to-cyan-500",
    },
    {
      id: "community",
      title: "Community Network",
      description:
        "Join a vibrant community of change-makers sharing ideas, resources, and supporting each other's initiatives.",
      icon: FaUsers,
      color: "from-purple-600 to-pink-500",
    },
    {
      id: "discussions",
      title: "Live Chat Channels",
      description: "Engage in real-time discussions with topic experts and passionate advocates in dedicated channels.",
      icon: FaComments,
      color: "from-indigo-600 to-blue-500",
    },
    {
      id: "personalization",
      title: "Personalized Causes",
      description:
        "Find your passion with our interactive quiz and get matched with causes that align with your values.",
      icon: FaLightbulb,
      color: "from-green-600 to-emerald-500",
    },
  ];

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      nextFeature();
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Features */}
      <AnimatePresence mode="wait">
        {features.map(
          (feature, index) =>
            activeFeature === index && (
              <motion.div
                key={feature.id}
                className="absolute inset-0 flex flex-col"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Feature visual representation */}
                <div className="relative h-[220px] rounded-xl mb-4 overflow-hidden group">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-40`}
                    whileHover={{ opacity: 0.6 }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Fallback visualization with icon */}
                  <div className="w-full h-full flex items-center justify-center">
                    <feature.icon className="text-6xl text-white/70" />
                  </div>

                  {/* Feature icon badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <feature.icon className="text-white text-xl" />
                  </div>

                  {/* Interactive elements that respond to mouse movement */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-white/60"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + Math.sin(i) * 15}%`,
                      }}
                      animate={{
                        y: [0, -10 - i * 2, 0],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                {/* Feature content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{feature.description}</p>

                  <motion.button
                    className="mt-auto self-start px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center gap-2 text-sm"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Explore Feature</span>
                    <FaArrowRight className="text-xs" />
                  </motion.button>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation arrows */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center">
        <motion.button
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/20"
          onClick={prevFeature}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowLeft className="text-xs" />
        </motion.button>

        {/* Indicator dots */}
        <div className="flex space-x-2">
          {features.map((_, idx) => (
            <button
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeFeature === idx ? "bg-white w-6" : "bg-white/30"
              }`}
              onClick={() => setActiveFeature(idx)}
            />
          ))}
        </div>

        <motion.button
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/20"
          onClick={nextFeature}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowRight className="text-xs" />
        </motion.button>
      </div>
    </div>
  );
};
