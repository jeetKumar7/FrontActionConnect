import { Link, useNavigate } from "react-router-dom";
import {
  FaHandsHelping,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { SignUpModal } from "./auth/AuthModals";

// YouTube videos with titles - each entry has URL and title
const youtubeVideos = [
  {
    url: "https://www.youtube.com/watch?v=-BvcToPZCLI",
    title: "The most important thing you can do to fight climate change",
  },
  {
    url: "https://www.youtube.com/watch?v=QMnEP2DYfmI",
    title: "Kindness and good deeds will come back to you",
  },
  {
    url: "https://www.youtube.com/watch?v=QQYgCxu988s",
    title: "Sustainable Development Goals",
  },
  {
    url: "https://www.youtube.com/watch?v=D9N7QaIOkG8",
    title: "One Earth - Environmental Short Film",
  },
  {
    url: "https://www.youtube.com/watch?v=RiE5Bv_wDNA",
    title: "An introduction to Health Impact Assessment",
  },
  {
    url: "https://www.youtube.com/watch?v=ay7Mp_HDxnM",
    title: "Tackling air pollution and climate change for global health",
  },
  {
    url: "https://www.youtube.com/watch?v=O1EAeNdTFHU",
    title: "The Ocean Cleanup System 001 Explained",
  },
  // Add new videos by adding both URL and title
];

// Helper function to extract YouTube video ID from URL
const extractVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

// Process video URLs to get required data
const videos = youtubeVideos
  .map((video) => {
    const id = extractVideoId(video.url);
    return {
      id,
      url: video.url,
      title: video.title,
      // Optionally add duration if needed
    };
  })
  .filter((video) => video.id !== null); // Filter out any invalid URLs

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const carouselRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null); // Add this line

  // Theme detection logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    // Initial theme check
    const isLightMode = document.body.classList.contains("light");
    setIsDarkMode(!isLightMode);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(!document.body.classList.contains("light"));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

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

  const openVideo = (video) => {
    // Updated to set the current video instead of opening a new tab
    setCurrentVideo(video);
  };

  const navigateToLibrary = () => {
    navigate("/library");
  };

  return (
    <section className="relative h-screen bg-gradient-to-b from-cyan-950 via-slate-900 to-fuchsia-900/70 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
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
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Part - Hero Content */}
        <div className="h-[80%] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-4xl">
            Connect,{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Inspire</span>,
            and Catalyze Change
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-slate-300/90 leading-relaxed max-w-3xl px-2 sm:px-0">
            We bring together passionate individuals and diverse social causes, sparking meaningful conversations that
            transform shared vision into measurable societal impact.
          </p>
          <div className="mt-5 sm:mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center w-full px-2 sm:px-0">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-3 px-5 sm:px-6 rounded-md font-medium shadow-lg hover:from-cyan-500 hover:to-teal-500 transition-all w-full sm:w-auto text-sm sm:text-base"
            >
              {isAuthenticated ? "Find Your Passion" : "Get Started"}
            </button>
            <Link
              to="/learn-more"
              className="text-white border border-teal-700/30 hover:border-teal-600/60 py-3 px-5 sm:px-6 rounded-md font-medium transition-all w-full sm:w-auto text-sm sm:text-base"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Bottom Part - Video Carousel */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 ${
            isDarkMode
              ? "bg-gradient-to-r from-slate-900/80 via-cyan-950/80 to-slate-900/80 border-white/10"
              : "bg-gradient-to-r from-slate-100/70 via-cyan-50/90 to-slate-100/90 border-slate-200"
          } backdrop-blur-md border-t`}
        >
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className={`text-base sm:text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                Impact Stories
              </h2>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => scrollCarousel("left")}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
                    isDarkMode
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-slate-300/40 hover:bg-slate-300/60 text-slate-700"
                  }`}
                >
                  <FaChevronLeft size={12} className="sm:hidden" />
                  <FaChevronLeft size={14} className="hidden sm:block" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
                    isDarkMode
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-slate-300/40 hover:bg-slate-300/60 text-slate-700"
                  }`}
                >
                  <FaChevronRight size={12} className="sm:hidden" />
                  <FaChevronRight size={14} className="hidden sm:block" />
                </button>
              </div>
            </div>
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-2 sm:gap-4 scrollbar-hide snap-x snap-mandatory pb-1"
            >
              {videos.map((video, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] h-[110px] sm:h-[130px] md:h-[140px] bg-black/20 rounded-lg overflow-hidden snap-start cursor-pointer relative group"
                  onClick={() => openVideo(video)}
                >
                  {/* Video Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt="Impact video"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Title Overlay - Shows at bottom on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 sm:p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-xs sm:text-sm font-semibold line-clamp-2">{video.title}</h3>
                  </div>

                  {/* Play Button - Centered */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FaPlay className="text-white" size={14} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Explore More Button */}
              <div
                className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] h-[110px] sm:h-[130px] md:h-[140px] bg-gradient-to-r from-teal-900/60 to-cyan-900/60 rounded-lg overflow-hidden snap-start cursor-pointer relative group"
                onClick={navigateToLibrary}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-1 sm:mb-2">
                    <FaArrowRight className="text-white" size={14} />
                  </div>
                  <span className="text-white text-sm font-medium text-center">Explore More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {currentVideo && (
        <VideoModal video={currentVideo} onClose={() => setCurrentVideo(null)} isDarkMode={isDarkMode} />
      )}

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
}

// Video Modal Component
const VideoModal = ({ video, onClose, isDarkMode }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedback);
    setFeedback("");
    setShowFeedbackForm(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl relative" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-video relative shadow-2xl rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className={`p-3 sm:p-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          <h3 className="text-base sm:text-lg md:text-xl font-medium line-clamp-2">{video.title}</h3>
        </div>

        {/* Feedback Button - Positioned better for mobile */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="bg-black/30 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full shadow-md hover:bg-black/50 transition-opacity opacity-70 hover:opacity-100"
            aria-label="Give Feedback"
          >
            Feedback
          </button>
        </div>

        {/* Improved Feedback Form Modal */}
        {showFeedbackForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md mx-2">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Give Feedback</h2>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    rows="4"
                    placeholder="Write your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-md shadow-md hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  Want to provide feedback on other parts of the site?{" "}
                  <a href="/feedback" className="text-blue-600 hover:underline">
                    Go to Feedback Page
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Close Button - Better positioned for mobile */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 sm:-top-12 text-white hover:text-gray-300"
          aria-label="Close video"
        >
          <FaTimes size={20} className="sm:hidden" />
          <FaTimes size={24} className="hidden sm:block" />
        </button>
      </div>
    </div>
  );
};
