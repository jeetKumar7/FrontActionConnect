import React, { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useDebounce } from "../hooks/useDebounce";
import {
  fetchYouTubeVideos,
  fetchNewsArticles,
  fetchBooks,
  fetchTedTalks,
  getTrendingTopics,
} from "../utils/contentApi";
import {
  FaSearch,
  FaVideo,
  FaNewspaper,
  FaBook,
  FaMicrophone,
  FaFilter,
  FaClock,
  FaHeart,
  FaShare,
  FaChevronDown,
  FaTimesCircle,
  FaCalendarAlt,
  FaSort,
  FaStar,
} from "react-icons/fa";

// Theme detection hook
const useThemeDetection = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
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

  return isDarkMode;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const LoadingSkeleton = ({ isDarkMode }) => (
  <>
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className={`animate-pulse ${isDarkMode ? "bg-white/5" : "bg-slate-100"} rounded-xl overflow-hidden border ${
          isDarkMode ? "border-indigo-500/10" : "border-slate-200"
        } shadow-lg`}
      >
        <div
          className={`h-48 ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-800/80 to-slate-900/80"
              : "bg-gradient-to-br from-slate-200 to-slate-300"
          }`}
        />
        <div className="p-4 space-y-4">
          <div className={`h-4 ${isDarkMode ? "bg-white/10" : "bg-slate-200"} rounded-full w-3/4`} />
          <div className={`h-4 ${isDarkMode ? "bg-white/10" : "bg-slate-200"} rounded-full w-1/2`} />
          <div className={`h-4 ${isDarkMode ? "bg-white/10" : "bg-slate-200"} rounded-full w-full`} />
          <div className="flex justify-between pt-2">
            <div className={`h-3 ${isDarkMode ? "bg-white/10" : "bg-slate-200"} rounded-full w-1/4`} />
            <div className={`h-3 ${isDarkMode ? "bg-white/10" : "bg-slate-200"} rounded-full w-1/5`} />
          </div>
        </div>
      </div>
    ))}
  </>
);

const EmptyState = ({ isDarkMode }) => (
  <div className="text-center py-12 w-full col-span-full">
    <div
      className={`w-16 h-16 mx-auto ${
        isDarkMode ? "bg-indigo-500/10" : "bg-indigo-100"
      } rounded-full flex items-center justify-center mb-4`}
    >
      <FaSearch className={`text-3xl ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`} />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">No content found</h3>
    <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Try adjusting your search or filters</p>
  </div>
);

const ContentCard = ({ item, isDarkMode }) => {
  const getContentUrl = () => {
    if (item.type === "book") {
      return item.previewLink || item.infoLink || item.canonicalVolumeLink;
    }
    return item.url;
  };

  return (
    <motion.div
      className={`group ${
        isDarkMode
          ? "bg-white/5 backdrop-blur-sm border-indigo-500/10 hover:border-indigo-500/30 shadow-lg"
          : "bg-white border-slate-200 hover:border-indigo-300 shadow-md hover:shadow-lg"
      } rounded-xl overflow-hidden border transition-all`}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <a href={getContentUrl()} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative">
          <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <motion.span
                className={`text-sm ${
                  isDarkMode ? "bg-indigo-600/80" : "bg-indigo-600"
                } backdrop-blur-sm px-3 py-1 rounded-full text-white`}
                whileHover={{ scale: 1.05 }}
              >
                {item.type}
              </motion.span>
              <div className="flex gap-2">
                <motion.button
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    // Add like functionality here
                  }}
                >
                  <FaHeart className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    // Share functionality - you can use the Web Share API
                    if (navigator.share) {
                      navigator.share({
                        title: item.title,
                        text: item.description,
                        url: item.url,
                      });
                    }
                  }}
                >
                  <FaShare className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3
            className={`font-semibold text-lg mb-2 line-clamp-2 ${
              isDarkMode ? "group-hover:text-indigo-400" : "text-slate-800 group-hover:text-indigo-600"
            } transition-colors`}
          >
            {item.title}
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-slate-300/70" : "text-slate-600"} mb-4 line-clamp-2`}>
            {item.description}
          </p>
          <div
            className={`flex items-center justify-between text-sm ${
              isDarkMode ? "text-[var(--text-primary)]/40" : "text-slate-500"
            }`}
          >
            <span>{item.source || item.author}</span>
            <span className="flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              {formatDate(item.publishedAt)}
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

ContentCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    type: PropTypes.string,
    source: PropTypes.string,
    author: PropTypes.string,
    publishedAt: PropTypes.string,
    url: PropTypes.string,
    previewLink: PropTypes.string,
    infoLink: PropTypes.string,
    canonicalVolumeLink: PropTypes.string,
  }).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

const ContentLibrary = () => {
  const isDarkMode = useThemeDetection();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    date: "any",
    source: [],
    sortBy: "relevance",
  });
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  // Mouse tracking
  React.useEffect(() => {
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

  const dateOptions = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "year", label: "This year" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "date", label: "Date (newest)" },
    { value: "popularity", label: "Popularity" },
  ];

  const clearFilters = () => {
    setFilters({
      date: "any",
      source: [],
      sortBy: "relevance",
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const { data: trendingTopics = [] } = useQuery({
    queryKey: ["trendingTopics"],
    queryFn: getTrendingTopics,
  });

  const { data: videos = [], isLoading: isVideosLoading } = useQuery({
    queryKey: ["videos", debouncedSearch],
    queryFn: () => fetchYouTubeVideos(debouncedSearch || "social impact"),
    enabled: activeTab === "all" || activeTab === "videos",
  });

  const { data: articles = [], isLoading: isArticlesLoading } = useQuery({
    queryKey: ["articles", debouncedSearch],
    queryFn: () => fetchNewsArticles(debouncedSearch || "social causes"),
    enabled: activeTab === "all" || activeTab === "articles",
  });

  const { data: books = [], isLoading: isBooksLoading } = useQuery({
    queryKey: ["books", debouncedSearch],
    queryFn: () => fetchBooks(debouncedSearch || "social change"),
    enabled: activeTab === "all" || activeTab === "books",
  });

  const { data: talks = [], isLoading: isTalksLoading } = useQuery({
    queryKey: ["talks", debouncedSearch],
    queryFn: () => fetchTedTalks(debouncedSearch || "social impact"),
    enabled: activeTab === "all" || activeTab === "talks",
  });

  const isLoading = isVideosLoading || isArticlesLoading || isBooksLoading || isTalksLoading;

  const filteredContent = useMemo(() => {
    let content = [];
    switch (activeTab) {
      case "all":
        content = [...videos, ...articles, ...books, ...talks];
        break;
      case "videos":
        content = videos;
        break;
      case "articles":
        content = articles;
        break;
      case "books":
        content = books;
        break;
      case "talks":
        content = talks;
        break;
      default:
        content = [];
    }

    // Date filtering
    if (filters.date !== "any") {
      const now = new Date();
      let cutoffDate = new Date();

      switch (filters.date) {
        case "today":
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      content = content.filter((item) => {
        const publishDate = new Date(item.publishedAt);
        return publishDate >= cutoffDate;
      });
    }

    // Source filtering
    if (filters.source.length > 0) {
      content = content.filter((item) => filters.source.includes(item.source) || filters.source.includes(item.author));
    }

    // Sorting
    switch (filters.sortBy) {
      case "date":
        content.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case "popularity":
        content.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        // Keep default order
        break;
    }

    return content;
  }, [activeTab, videos, articles, books, talks, filters]);

  const getSources = useMemo(() => {
    const sources = new Set();
    [...videos, ...articles, ...books, ...talks].forEach((item) => {
      if (item.source) sources.add(item.source);
      if (item.author) sources.add(item.author);
    });
    return Array.from(sources);
  }, [videos, articles, books, talks]);

  return (
    <div
      ref={sectionRef}
      className={`relative min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80"
          : "bg-gradient-to-b from-slate-50 via-white to-indigo-50/80"
      } text-[var(--text-primary)]`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient accent lights */}
        <div
          className={`absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full ${
            isDarkMode ? "bg-indigo-900/20" : "bg-indigo-200/30"
          } blur-[120px]`}
        ></div>
        <div
          className={`absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full ${
            isDarkMode ? "bg-purple-900/20" : "bg-purple-200/30"
          } blur-[120px]`}
        ></div>

        {/* Subtle noise texture */}
        <div
          className={`absolute inset-0 opacity-[0.015] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]`}
        >
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        {/* Responsive glow following cursor */}
        <motion.div
          className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.07] pointer-events-none`}
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.2) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 40%, transparent 70%)",
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

      {/* Main Content */}
      <div className="relative z-10 mt-14">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-[var(--bg-primary)] py-20">
          {/* Background Video */}
          <video className="absolute inset-0 w-full h-full object-cover opacity-90" autoPlay loop muted playsInline>
            <source
              src="https://res.cloudinary.com/dak1w5wyf/video/upload/v1745846381/10070127-hd_1920_1080_24fps_1_utluuj.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Overlay for better text readability */}
          <div className={`absolute inset-0 ${isDarkMode ? "bg-black/50" : "bg-black/40"}`}></div>

          <motion.div
            className="relative container mx-auto px-4"
            style={{ y: contentY, opacity }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`inline-block px-4 py-1.5 rounded-full ${
                isDarkMode ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-100 border-indigo-200"
              } border mb-6 mx-auto`}
            >
              <span className={`${isDarkMode ? "text-indigo-300" : "text-indigo-600"} text-sm font-medium`}>
                Content Library
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white">
              Discover <span className={isDarkMode ? "text-indigo-400" : "text-indigo-300"}>Impactful</span> Content
            </h1>
            <p className="text-xl text-center text-white/80 mb-8 max-w-2xl mx-auto">
              Explore curated videos, articles, books, and talks about social causes and make a difference.
            </p>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <input
                type="text"
                placeholder="Search for content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-6 py-4 rounded-xl ${
                  isDarkMode ? "bg-white/10 border-indigo-500/20" : "bg-white/20 border-indigo-300/30"
                } backdrop-blur-lg border text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-lg transition-all`}
              />
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSearch className="text-indigo-400" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          {/* Trending Topics */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span
                className={`w-8 h-8 ${
                  isDarkMode ? "bg-indigo-500/10" : "bg-indigo-100"
                } rounded-lg flex items-center justify-center mr-3`}
              >
                <FaStar className={`${isDarkMode ? "text-indigo-400" : "text-indigo-500"} text-sm`} />
              </span>
              Trending Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSearchQuery(topic)}
                  className={`px-4 py-2 rounded-full ${
                    isDarkMode
                      ? "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20"
                      : "bg-indigo-50 hover:bg-indigo-100 border-indigo-200/50"
                  } backdrop-blur-sm border transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Controls */}
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Tabs */}
            <div className="flex gap-2 w-full sm:w-auto scrollbar-none hover:scrollbar-none pb-2 sm:pb-0">
              {[
                { icon: <FaVideo />, label: "All", value: "all" },
                { icon: <FaVideo />, label: "Videos", value: "videos" },
                { icon: <FaNewspaper />, label: "Articles", value: "articles" },
                { icon: <FaBook />, label: "Books", value: "books" },
                { icon: <FaMicrophone />, label: "Talks", value: "talks" },
              ].map((tab) => (
                <motion.button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.value
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : isDarkMode
                      ? "bg-white/5 hover:bg-white/10 border border-indigo-500/10"
                      : "bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Filter Button with active filter indicator */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg relative ${
                isDarkMode
                  ? "bg-white/5 hover:bg-white/10 border border-indigo-500/10"
                  : "bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFilter
                className={
                  filters.date !== "any" || filters.source.length > 0 || filters.sortBy !== "relevance"
                    ? isDarkMode
                      ? "text-indigo-400"
                      : "text-indigo-600"
                    : ""
                }
              />
              <span>Filters</span>
              {(filters.date !== "any" || filters.source.length > 0 || filters.sortBy !== "relevance") && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-500 rounded-full text-xs flex items-center justify-center text-white">
                  {(filters.date !== "any" ? 1 : 0) +
                    (filters.source.length > 0 ? 1 : 0) +
                    (filters.sortBy !== "relevance" ? 1 : 0)}
                </span>
              )}
            </motion.button>
          </motion.div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className={`w-full ${
                  isDarkMode
                    ? "bg-slate-800/90 backdrop-blur-md border-indigo-500/10"
                    : "bg-white/90 backdrop-blur-md border-slate-200"
                } border rounded-xl p-6 mb-8 shadow-xl`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={clearFilters}
                      className={`text-sm flex items-center gap-1 ${
                        isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
                      }`}
                    >
                      <FaTimesCircle size={14} />
                      Clear all
                    </button>
                    <motion.button
                      onClick={() => setShowFilters(false)}
                      className="text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimesCircle size={16} />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Date Filter */}
                  <div className="space-y-2">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? "text-[var(--text-primary)]/80" : "text-slate-600"
                      }`}
                    >
                      <FaCalendarAlt className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
                      <span>Date</span>
                    </div>
                    <div className="relative">
                      <select
                        value={filters.date}
                        onChange={(e) => handleFilterChange("date", e.target.value)}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-white/5 border-indigo-500/20 text-[var(--text-primary)]"
                            : "bg-white border-slate-200 text-slate-800"
                        } border rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                        style={{ colorScheme: isDarkMode ? "dark" : "light" }}
                      >
                        {dateOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            style={{
                              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                              color: isDarkMode ? "white" : "#1e293b",
                            }}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                        size={12}
                      />
                    </div>
                  </div>

                  {/* Sort By Filter */}
                  <div className="space-y-2">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? "text-[var(--text-primary)]/80" : "text-slate-600"
                      }`}
                    >
                      <FaSort className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
                      <span>Sort By</span>
                    </div>
                    <div className="relative">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-white/5 border-indigo-500/20 text-[var(--text-primary)]"
                            : "bg-white border-slate-200 text-slate-800"
                        } border rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                        style={{ colorScheme: isDarkMode ? "dark" : "light" }}
                      >
                        {sortOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            style={{
                              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                              color: isDarkMode ? "white" : "#1e293b",
                            }}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                        size={12}
                      />
                    </div>
                  </div>
                </div>

                {/* Source Filters - only show if there are sources */}
                {getSources.length > 0 && (
                  <div className={`mt-6 pt-4 border-t ${isDarkMode ? "border-indigo-500/10" : "border-slate-200"}`}>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? "text-[var(--text-primary)]/80" : "text-slate-600"
                      } mb-2`}
                    >
                      <span>Sources</span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2">
                      {getSources.map((source) => (
                        <motion.button
                          key={source}
                          onClick={() => {
                            if (filters.source.includes(source)) {
                              handleFilterChange(
                                "source",
                                filters.source.filter((s) => s !== source)
                              );
                            } else {
                              handleFilterChange("source", [...filters.source, source]);
                            }
                          }}
                          className={`px-3 py-1 text-sm rounded-full transition-all ${
                            filters.source.includes(source)
                              ? isDarkMode
                                ? "bg-indigo-600 text-[var(--text-primary)]"
                                : "bg-indigo-600 text-white"
                              : isDarkMode
                              ? "bg-white/5 text-[var(--text-primary)]/70 hover:bg-white/10 border border-indigo-500/10"
                              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {source}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Filters */}
                {(filters.date !== "any" || filters.source.length > 0 || filters.sortBy !== "relevance") && (
                  <div className={`mt-6 pt-4 border-t ${isDarkMode ? "border-indigo-500/10" : "border-slate-200"}`}>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? "text-[var(--text-primary)]/80" : "text-slate-600"
                      } mb-2`}
                    >
                      <span>Active Filters:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.date !== "any" && (
                        <div
                          className={`px-3 py-1 text-sm rounded-full ${
                            isDarkMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                          } flex items-center gap-1`}
                        >
                          <span>{dateOptions.find((o) => o.value === filters.date)?.label}</span>
                          <motion.button
                            onClick={() => handleFilterChange("date", "any")}
                            className="ml-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTimesCircle size={12} />
                          </motion.button>
                        </div>
                      )}

                      {filters.sortBy !== "relevance" && (
                        <div
                          className={`px-3 py-1 text-sm rounded-full ${
                            isDarkMode ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"
                          } flex items-center gap-1`}
                        >
                          <span>Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label}</span>
                          <motion.button
                            onClick={() => handleFilterChange("sortBy", "relevance")}
                            className="ml-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTimesCircle size={12} />
                          </motion.button>
                        </div>
                      )}

                      {filters.source.map((source) => (
                        <div
                          key={source}
                          className={`px-3 py-1 text-sm rounded-full ${
                            isDarkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                          } flex items-center gap-1`}
                        >
                          <span>{source}</span>
                          <motion.button
                            onClick={() =>
                              handleFilterChange(
                                "source",
                                filters.source.filter((s) => s !== source)
                              )
                            }
                            className="ml-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTimesCircle size={12} />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {isLoading ? (
              <LoadingSkeleton isDarkMode={isDarkMode} />
            ) : filteredContent.length > 0 ? (
              filteredContent.map((item, index) => (
                <motion.div
                  key={item.id || item.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
                >
                  <ContentCard item={item} isDarkMode={isDarkMode} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState isDarkMode={isDarkMode} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
