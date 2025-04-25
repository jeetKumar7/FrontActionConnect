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
                src="https://res.cloudinary.com/dak1w5wyf/video/upload/v1745567292/bg_video_mwddnj.mp4"
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
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
                className="group relative bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-8 py-4 rounded-md font-medium shadow-lg shadow-cyan-700/20 hover:from-cyan-500 hover:to-teal-500 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  {isAuthenticated ? "Find Your Cause" : "Get Started"}
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
                  className="text-white border border-teal-700/30 hover:border-teal-600/60 px-8 py-4 rounded-md font-medium transition-all"
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
                    <span className="block font-bold text-2xl text-white">{stat.value}</span>
                    <span className="block text-sm text-slate-300">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right side feature showcase */}
        <motion.div className="hidden lg:block w-full lg:w-1/2 lg:pl-8 relative" style={{ y: imageY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative h-[500px] w-full max-w-[500px] mx-auto"
          >
            {/* Updated showcase container with fresh gradient */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-800/30 via-teal-700/20 to-amber-700/30 backdrop-blur-sm shadow-2xl border border-cyan-400/10 overflow-hidden">
              {/* Updated header */}
              <div className="absolute top-0 left-0 right-0 px-6 py-4 bg-gradient-to-b from-cyan-800/80 to-transparent z-10">
                <h3 className="text-xl font-medium text-white/90">Platform Features</h3>
                <div className="h-0.5 w-16 bg-cyan-400/60 mt-1"></div>
              </div>

              {/* Feature showcase content stays the same */}
              <div className="absolute inset-0 pt-16 px-6 pb-16">
                <FeatureShowcase />
              </div>
            </div>

            {/* Updated decorative elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <motion.div
              className="absolute -bottom-10 -left-5 w-28 h-28 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-400/20 blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </motion.div>
      </div>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}

// Interactive Feature Showcase Component
const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      id: "map",
      title: "Interactive Map",
      description:
        "Discover local initiatives and connect with like-minded individuals in your area working on environmental and social causes.",
      icon: FaMapMarkerAlt,
      color: "from-cyan-600 to-teal-500", // Updated color
      path: "/map",
    },
    {
      id: "community",
      title: "Community Network",
      description:
        "Join a vibrant community of change-makers sharing ideas, resources, and supporting each other's initiatives.",
      icon: FaUsers,
      color: "from-amber-500 to-orange-500", // Updated color
      path: "/community",
    },
    {
      id: "discussions",
      title: "Live Chat Channels",
      description: "Engage in real-time discussions with topic experts and passionate advocates in dedicated channels.",
      icon: FaComments,
      color: "from-fuchsia-500 to-pink-500", // Updated color
      path: "/community/channels",
    },
    {
      id: "personalization",
      title: "Personalized Causes",
      description:
        "Find your passion with our interactive quiz and get matched with causes that align with your values.",
      icon: FaLightbulb,
      color: "from-emerald-500 to-teal-500", // Updated color
      path: "/passion",
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

  const handleExploreFeature = () => {
    const feature = features[activeFeature];
    if (feature.path) {
      navigate(feature.path); // Navigate to the feature's path
    }
  };

  return (
    <div className="relative h-full overflow-hidden flex flex-col">
      {/* Features Content - Takes up most of the space */}
      <div className="flex-1 relative">
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
                  <div className="relative h-[220px] rounded-xl overflow-hidden group">
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
                  </div>

                  {/* Feature content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">{feature.description}</p>

                    <motion.button
                      onClick={handleExploreFeature}
                      className={`mt-auto self-start px-4 py-2 rounded-lg bg-gradient-to-r ${feature.color} text-white flex items-center gap-2 text-sm`}
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
      </div>

      {/* Navigation arrows - MOVED OUTSIDE the animated content so they stay in place */}
      <div className="flex justify-between items-center py-3 mt-4">
        <motion.button
          className="w-8 h-8 rounded-full bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center border border-cyan-400/20 text-white/70 hover:text-white hover:bg-cyan-500/20"
          onClick={prevFeature}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowLeft className="text-xs" />
        </motion.button>

        {/* Updated indicator dots */}
        <div className="flex space-x-2">
          {features.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                activeFeature === idx ? "bg-cyan-400 w-5" : "bg-white/30"
              }`}
              onClick={() => setActiveFeature(idx)}
            />
          ))}
        </div>

        <motion.button
          className="w-8 h-8 rounded-full bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center border border-cyan-400/20 text-white/70 hover:text-white hover:bg-cyan-500/20"
          onClick={nextFeature}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowRight className="text-xs" />
        </motion.button>
      </div>
    </div>
  );
};
