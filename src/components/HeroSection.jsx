import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  FaHandsHelping,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { SignUpModal } from "./auth/AuthModals";

// YouTube videos data - easy to update
const videos = [
  {
    id: "-BvcToPZCLI",
    title: "Most important thing you can do to fight climate change.",
    duration: "7:47",
  },
  {
    id: "G4H1N_yXBiA",
    title: "Causes and Effects of Climate Change",
    duration: "3:04",
  },
  {
    id: "3WODX8fyRHA",
    title: "What is sustainaible development?",
    duration: "2:08",
  },
  {
    id: "2DUlYQTrsOs",
    title: "Lets end poverty",
    duration: "14:45",
  },
];

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const carouselRef = useRef(null);

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

  // Scroll carousel horizontally
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = direction === "left" ? -260 : 260;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });

    // Update active index for indicator dots
    const scrollPosition = carouselRef.current.scrollLeft + scrollAmount;
    const newIndex = Math.round(scrollPosition / 260);
    setActiveVideoIndex(Math.max(0, Math.min(newIndex, videos.length - 1)));
  };

  // Open YouTube video in new tab
  const openVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <section className="h-screen overflow-hidden bg-gradient-to-b from-cyan-950 via-slate-900 to-fuchsia-900/70 pt-16 flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 top-16 z-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!isMobile && (
            <video
              className="absolute w-full h-full object-cover opacity-100"
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
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="absolute inset-0 opacity-[0.01] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]">
          <div className="absolute inset-0 bg-noise"></div>
        </div>
        <div className="absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full bg-cyan-600/20 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full bg-amber-500/10 blur-[120px]"></div>
        <div className="absolute right-1/3 top-1/3 w-1/3 aspect-square rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      {/* Main content grid */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full">
        <div className="flex flex-col lg:flex-row h-full pt-4 pb-6">
          {/* Left side - Hero content */}
          <div className="w-full lg:w-1/2 lg:pr-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-lg"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                Connect,{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Inspire
                </span>
                , and Catalyze Change
              </h1>

              <p className="mt-4 text-base md:text-lg text-slate-300/90 leading-relaxed max-w-lg">
                We bring together passionate individuals and diverse social causes, sparking meaningful conversations
                that transform shared vision into measurable societal impact.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <motion.button
                  onClick={handleGetStarted}
                  className="group relative bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-md font-medium shadow-lg shadow-cyan-700/20 hover:from-cyan-500 hover:to-teal-500 transition-all"
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
                    className="text-white border border-teal-700/30 hover:border-teal-600/60 px-6 py-3 rounded-md font-medium transition-all"
                    whileHover={{ backgroundColor: "rgba(20, 184, 166, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>

              {/* Stats section */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  {
                    icon: FaHandsHelping,
                    value: "10k+",
                    label: "Causes",
                    bgColor: "bg-cyan-500/10",
                    iconColor: "text-cyan-400",
                  },
                  {
                    icon: FaUsers,
                    value: "500+",
                    label: "Actions",
                    bgColor: "bg-amber-500/10",
                    iconColor: "text-amber-400",
                  },
                  {
                    icon: FaChartLine,
                    value: "95%",
                    label: "Success",
                    bgColor: "bg-emerald-500/10",
                    iconColor: "text-emerald-400",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                      <stat.icon className={`${stat.iconColor} text-lg`} />
                    </div>
                    <div>
                      <span className="block font-bold text-xl text-white">{stat.value}</span>
                      <span className="block text-xs text-slate-300">{stat.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right side - Video carousel */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center mt-6 lg:mt-0 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Impact Stories</h2>
                  <p className="text-white/70 text-xs">Discover how our community creates change</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollCarousel("left")}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() => scrollCarousel("right")}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Video carousel */}
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory gap-3"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {videos.map((video, idx) => (
                    <motion.div
                      key={idx}
                      className="flex-shrink-0 w-[250px] h-[150px] relative rounded-lg overflow-hidden snap-start cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.3)" }}
                      onClick={() => openVideo(video.id)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3">
                        <div className="flex justify-center items-center h-full opacity-80 hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FaPlay className="text-white ml-1" size={14} />
                          </div>
                        </div>
                        <h3 className="text-white font-medium text-xs mt-auto">{video.title}</h3>
                        <p className="text-white/70 text-[10px] mt-1">{video.duration}</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Explore more card */}
                  <motion.div
                    className="flex-shrink-0 w-[250px] h-[150px] bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg flex flex-col items-center justify-center p-4 snap-end"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.2)" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mb-2">
                      <FaArrowRight className="text-white" size={12} />
                    </div>
                    <p className="text-white font-medium text-xs text-center mb-2">Discover more videos</p>
                    <Link
                      to="/library"
                      className="text-[10px] px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white"
                    >
                      Explore Library
                    </Link>
                  </motion.div>
                </div>

                {/* Scroll indicators */}
                <div className="flex justify-center mt-3 gap-1">
                  {Array.from({ length: Math.min(5, videos.length + 1) }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        activeVideoIndex === idx ? "bg-cyan-400" : "bg-white/20"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
