import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLightbulb,
  FaBug,
  FaSmile,
  FaQuestion,
  FaVideo,
  FaCheckCircle,
  FaPaperPlane,
  FaMapMarkedAlt,
  FaUsers,
  FaClipboardList,
  FaSpinner,
} from "react-icons/fa";

// Add theme detection hook
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

export default function Feedback() {
  const isDarkMode = useThemeDetection();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    email: "",
    name: "",
    rating: 3,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("form"); // 'form' or 'submitted'

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    setIsAuthenticated(!!token);

    if (token && userEmail && userName) {
      setFormData((prev) => ({
        ...prev,
        email: userEmail,
        name: userName,
      }));
    }
  }, []);

  // Categories for feedback
  const feedbackCategories = [
    {
      id: "suggestion",
      name: "Feature Suggestion",
      icon: FaLightbulb,
      color: isDarkMode ? "text-yellow-400" : "text-yellow-600",
      bgColor: isDarkMode ? "bg-yellow-500/10" : "bg-yellow-100",
    },
    {
      id: "bug",
      name: "Report a Bug",
      icon: FaBug,
      color: isDarkMode ? "text-red-400" : "text-red-600",
      bgColor: isDarkMode ? "bg-red-500/10" : "bg-red-100",
    },
    {
      id: "experience",
      name: "User Experience",
      icon: FaSmile,
      color: isDarkMode ? "text-green-400" : "text-green-600",
      bgColor: isDarkMode ? "bg-green-500/10" : "bg-green-100",
    },
    {
      id: "video",
      name: "Video Feedback",
      icon: FaVideo,
      color: isDarkMode ? "text-blue-400" : "text-blue-600",
      bgColor: isDarkMode ? "bg-blue-500/10" : "bg-blue-100",
    },
    {
      id: "other",
      name: "Other",
      icon: FaQuestion,
      color: isDarkMode ? "text-purple-400" : "text-purple-600",
      bgColor: isDarkMode ? "bg-purple-500/10" : "bg-purple-100",
    },
  ];

  // Form sections (which part of the site the feedback is about)
  const siteSections = [
    { id: "home", name: "Home Page" },
    { id: "passion", name: "Find Your Passion" },
    { id: "community", name: "Community Features" },
    { id: "map", name: "Interactive Map" },
    { id: "hub", name: "Action Hub" },
    { id: "profile", name: "User Profile" },
    { id: "video", name: "Video Content" },
    { id: "other", name: "Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, category: categoryId });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!formData.category) {
      setError("Please select a feedback category");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please provide a title for your feedback");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please provide a description");
      return;
    }

    if (!isAuthenticated && !formData.email.trim()) {
      setError("Please provide your email address");
      return;
    }

    // Submit form
    setSubmitting(true);

    try {
      // This is where you would send the data to your backend
      // const response = await submitFeedback(formData);

      // For now, simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setActiveSection("submitted");

      // Reset form
      setFormData({
        category: "",
        title: "",
        description: "",
        email: formData.email, // Keep email if user submits another feedback
        name: formData.name,
        rating: 3,
      });
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setActiveSection("form");
    setSuccess(false);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80"
          : "bg-gradient-to-b from-white via-slate-50 to-indigo-50/80"
      } text-[var(--text-primary)] pt-20 pb-16`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full bg-cyan-600/10 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full bg-teal-600/10 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Feedback
              <span
                className={`bg-gradient-to-r ${
                  isDarkMode ? "from-cyan-400 to-teal-400" : "from-blue-500 to-cyan-500"
                } bg-clip-text text-transparent ml-2`}
              >
                Matters
              </span>
            </h1>
            <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-lg max-w-2xl mx-auto`}>
              Help us improve ActionConnect by sharing your thoughts, reporting issues, or suggesting new features.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeSection === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                } backdrop-blur-sm rounded-2xl border p-6 md:p-8 shadow-xl`}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Categories */}
                  <div className="space-y-2">
                    <label className="block text-[var(--text-primary)]/80 font-medium">
                      What type of feedback do you have?*
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {feedbackCategories.map((category) => (
                        <motion.button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            formData.category === category.id
                              ? isDarkMode
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-blue-500 bg-blue-50"
                              : isDarkMode
                              ? "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
                              : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`p-2 rounded-full ${category.bgColor}`}>
                            <category.icon className={`${category.color}`} />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Site Section */}
                  <div>
                    <label className="block text-[var(--text-primary)]/80 font-medium mb-2">
                      Which part of ActionConnect is this about?
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    >
                      <option value="">Select a section</option>
                      {siteSections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[var(--text-primary)]/80 font-medium mb-2">Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Summarize your feedback in a few words"
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-white/40"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[var(--text-primary)]/80 font-medium mb-2">Description*</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please provide detailed information about your feedback"
                      rows="5"
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-white/40"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      required
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-[var(--text-primary)]/80 font-medium mb-2">
                      How would you rate your experience with ActionConnect?
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(rating)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            formData.rating === rating
                              ? isDarkMode
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : isDarkMode
                              ? "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info (if not authenticated) */}
                  {!isAuthenticated && (
                    <div className="space-y-4">
                      <div className={`border-t border-b py-4 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                        <h3 className="text-lg font-medium mb-2">Your Contact Information</h3>
                        <p className={`${isDarkMode ? "text-white/60" : "text-slate-500"} text-sm mb-4`}>
                          Let us know how to reach you if we have follow-up questions.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 font-medium mb-2">Email Address*</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-white/5 border-white/10 text-white placeholder-white/40"
                              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 font-medium mb-2">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name (optional)"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-white/5 border-white/10 text-white placeholder-white/40"
                              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg flex items-center justify-center"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" /> Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" /> Submit Feedback
                        </>
                      )}
                    </motion.button>

                    <p className={`mt-4 text-center text-sm ${isDarkMode ? "text-white/50" : "text-slate-500"}`}>
                      Your feedback helps us improve ActionConnect for everyone. Thank you for your contribution!
                    </p>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                } backdrop-blur-sm rounded-2xl border p-8 shadow-xl text-center`}
              >
                <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <FaCheckCircle className="text-4xl text-green-400" />
                </div>

                <h2 className="text-2xl font-bold mb-4">Thank You for Your Feedback!</h2>

                <p className={`${isDarkMode ? "text-white/70" : "text-slate-600"} mb-8`}>
                  We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve
                  ActionConnect for everyone.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={resetForm}
                    className="py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Another Feedback
                  </motion.button>

                  <motion.button
                    onClick={() => (window.location.href = "/")}
                    className={`py-2 px-6 ${
                      isDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200"
                    } font-medium rounded-lg`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Return to Home
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
              } rounded-xl p-5 border`}
            >
              <div className={`p-3 rounded-full ${isDarkMode ? "bg-cyan-500/10" : "bg-cyan-50"} w-fit mb-4`}>
                <FaUsers className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community-Driven</h3>
              <p className={`${isDarkMode ? "text-white/60" : "text-slate-600"} text-sm`}>
                ActionConnect is built with input from users like you. Your feedback directly shapes our development
                priorities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
              } rounded-xl p-5 border`}
            >
              <div className={`p-3 rounded-full ${isDarkMode ? "bg-purple-500/10" : "bg-purple-50"} w-fit mb-4`}>
                <FaClipboardList className={isDarkMode ? "text-purple-400" : "text-purple-600"} size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">We're Listening</h3>
              <p className={`${isDarkMode ? "text-white/60" : "text-slate-600"} text-sm`}>
                Every piece of feedback is reviewed by our team. We're committed to continuous improvement based on user
                input.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
              } rounded-xl p-5 border`}
            >
              <div className={`p-3 rounded-full ${isDarkMode ? "bg-teal-500/10" : "bg-teal-50"} w-fit mb-4`}>
                <FaMapMarkedAlt className={isDarkMode ? "text-teal-400" : "text-teal-600"} size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Future Roadmap</h3>
              <p className={`${isDarkMode ? "text-white/60" : "text-slate-600"} text-sm`}>
                Your suggestions help us prioritize new features and improvements as we grow the ActionConnect platform.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
