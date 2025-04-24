import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const LoadingSkeleton = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <div key={i} className="animate-pulse bg-white/5 rounded-xl overflow-hidden border border-white/10">
        <div className="h-48 bg-white/10" />
        <div className="p-4 space-y-4">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="flex justify-between pt-2">
            <div className="h-3 bg-white/10 rounded w-1/4" />
            <div className="h-3 bg-white/10 rounded w-1/5" />
          </div>
        </div>
      </div>
    ))}
  </>
);

const EmptyState = () => (
  <div className="text-center py-12 w-full col-span-full">
    <FaSearch className="mx-auto text-4xl text-white/20 mb-4" />
    <h3 className="text-xl font-semibold mb-2">No content found</h3>
    <p className="text-white/60">Try adjusting your search or filters</p>
  </div>
);

const ContentCard = ({ item }) => {
  const getContentUrl = () => {
    if (item.type === "book") {
      return item.previewLink || item.infoLink || item.canonicalVolumeLink;
    }
    return item.url;
  };

  return (
    <motion.div
      className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
      whileHover={{ y: -5 }}
    >
      <a href={getContentUrl()} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative">
          <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <span className="text-sm bg-black/50 px-3 py-1 rounded-full">{item.type}</span>
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add like functionality here
                  }}
                >
                  <FaHeart className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
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
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-white/60 mb-4 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between text-sm text-white/40">
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
};

const ContentLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    date: "any",
    source: [],
    sortBy: "relevance",
  });
  const debouncedSearch = useDebounce(searchQuery, 500);

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

    // Filter by content type (tab)
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

    // Apply date filter
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

    // Apply source filter if any sources are selected
    if (filters.source.length > 0) {
      content = content.filter((item) => filters.source.includes(item.source) || filters.source.includes(item.author));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "date":
        content.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case "popularity":
        content.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "relevance":
      default:
        // Keep default order (already sorted by relevance)
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Add a top margin to account for the navbar */}
      <div className="mt-14">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Discover Impactful Content</h1>
            <p className="text-xl text-center text-white/80 mb-8 max-w-2xl mx-auto">
              Explore curated videos, articles, books, and talks about social causes and make a difference.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <FaSearch className="text-white/60" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Trending Topics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSearchQuery(topic)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === tab.value
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-white/5 hover:bg-white/10"
                  } transition-all`}
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFilter
                className={
                  filters.date !== "any" || filters.source.length > 0 || filters.sortBy !== "relevance"
                    ? "text-blue-400"
                    : ""
                }
              />
              <span>Filters</span>
              {(filters.date !== "any" || filters.source.length > 0 || filters.sortBy !== "relevance") && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center">
                  {(filters.date !== "any" ? 1 : 0) +
                    (filters.source.length > 0 ? 1 : 0) +
                    (filters.sortBy !== "relevance" ? 1 : 0)}
                </span>
              )}
            </motion.button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              className="w-full bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-xl p-4 mt-4 shadow-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearFilters}
                    className="text-sm flex items-center gap-1 text-white/60 hover:text-white"
                  >
                    <FaTimesCircle size={14} />
                    Clear all
                  </button>
                  <button onClick={() => setShowFilters(false)} className="text-white/60 hover:text-white">
                    <FaTimesCircle size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Filter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <FaCalendarAlt />
                    <span>Date</span>
                  </div>
                  <div className="relative">
                    <select
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white appearance-none"
                      style={{ colorScheme: "dark" }}
                    >
                      {dateOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          style={{ backgroundColor: "#1e293b", color: "white" }}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" size={12} />
                  </div>
                </div>

                {/* Sort By Filter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <FaSort />
                    <span>Sort By</span>
                  </div>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white appearance-none"
                      style={{ colorScheme: "dark" }}
                    >
                      {sortOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          style={{ backgroundColor: "#1e293b", color: "white" }}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" size={12} />
                  </div>
                </div>

                {/* Rating Filter */}
                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <FaStar />
                    <span>Minimum Rating</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={filters.rating}
                      onChange={(e) => handleFilterChange("rating", parseInt(e.target.value))}
                      className="w-full bg-white/10 rounded-lg appearance-none h-2 cursor-pointer"
                    />
                    <span className="ml-2 min-w-[24px] text-center">{filters.rating > 0 ? filters.rating : "Any"}</span>
                  </div>
                </div> */}
              </div>

              {/* Source Filters - only show if there are sources */}
              {getSources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                    <span>Sources</span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2">
                    {getSources.map((source) => (
                      <button
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
                            ? "bg-blue-500 text-white"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {(filters.date !== "any" || filters.source.length > 0 || filters.sortBy !== "relevance") && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                    <span>Active Filters:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.date !== "any" && (
                      <div className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                        <span>{dateOptions.find((o) => o.value === filters.date)?.label}</span>
                        <button onClick={() => handleFilterChange("date", "any")} className="ml-1">
                          <FaTimesCircle size={12} />
                        </button>
                      </div>
                    )}

                    {filters.sortBy !== "relevance" && (
                      <div className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-400 flex items-center gap-1">
                        <span>Sort: {sortOptions.find((o) => o.value === filters.sortBy)?.label}</span>
                        <button onClick={() => handleFilterChange("sortBy", "relevance")} className="ml-1">
                          <FaTimesCircle size={12} />
                        </button>
                      </div>
                    )}

                    {filters.source.map((source) => (
                      <div
                        key={source}
                        className="px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"
                      >
                        <span>{source}</span>
                        <button
                          onClick={() =>
                            handleFilterChange(
                              "source",
                              filters.source.filter((s) => s !== source)
                            )
                          }
                          className="ml-1"
                        >
                          <FaTimesCircle size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredContent.length > 0 ? (
              filteredContent.map((item) => <ContentCard key={item.id || item.url} item={item} />)
            ) : (
              <div className="col-span-full">
                <EmptyState />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
