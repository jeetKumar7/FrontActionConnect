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
  const carouselRef = useRef(null);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/passion");
    } else {
      setShowSignUp(true);
    }
  };

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = direction === "left" ? -300 : 300;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const openVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <section className="relative h-screen bg-gradient-to-b from-cyan-950 via-slate-900 to-fuchsia-900/70 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute w-full h-full object-cover opacity-90"
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
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Part - Hero Content */}
        <div className="h-[80%] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
            Connect,{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Inspire</span>,
            and Catalyze Change
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300/90 leading-relaxed max-w-3xl">
            We bring together passionate individuals and diverse social causes, sparking meaningful conversations that
            transform shared vision into measurable societal impact.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-md font-medium shadow-lg hover:from-cyan-500 hover:to-teal-500 transition-all"
            >
              {isAuthenticated ? "Find Your Passion" : "Get Started"}
            </button>
            <Link
              to="/learn-more"
              className="text-white border border-teal-700/30 hover:border-teal-600/60 px-6 py-3 rounded-md font-medium transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Bottom Part - Video Carousel - Now positioned with absolute positioning */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">Impact Stories</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  <FaChevronLeft size={14} />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
            <div ref={carouselRef} className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory">
              {videos.map((video, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-[280px] h-[140px] bg-black/20 rounded-lg overflow-hidden snap-start cursor-pointer relative group"
                  onClick={() => openVideo(video.id)}
                >
                  {/* Video Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-sm font-semibold">{video.title}</h3>
                    <p className="text-white/70 text-xs mt-1">{video.duration}</p>
                  </div>
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FaPlay className="text-white" size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}
