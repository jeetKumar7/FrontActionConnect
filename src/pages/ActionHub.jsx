import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { causes, getCausesByIds } from "../data/causes";
import {
  FaHandHoldingHeart,
  FaGraduationCap,
  FaDollarSign,
  FaUsers,
  FaSearch,
  FaGlobe,
  FaBookOpen,
  FaStar,
  FaArrowRight,
  FaFilter,
  FaRegCalendarCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaPlus,
  FaTimes,
  FaUpload,
  FaLink,
  FaCheck,
  FaUser,
  FaTrash,
  FaPen,
  FaInfoCircle,
  FaLeaf,
} from "react-icons/fa";
import {
  getOrganizations,
  getResources,
  getOpportunities,
  createOrganization,
  createResource,
  createOpportunity,
  deleteItem,
  uploadImage,
  getUserProfile,
  getSupportedCauses,
} from "../services";

const ActionHub = () => {
  // All existing state variables remain unchanged
  const [organizations, setOrganizations] = useState([]);
  const [resources, setResources] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState("organizations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([
    "All",
    "Environmental",
    "Social Justice",
    "Education",
    "Healthcare",
    "Poverty",
    "Human Rights",
    "Climate Change",
    "Racial Equity",
    "LGBTQ+ Rights",
    "Animal Rights",
  ]);
  const [user, setUser] = useState(null);
  const [showOnlyMyItems, setShowOnlyMyItems] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
  });
  const [supportedCauses, setSupportedCauses] = useState([]);
  const [filterBySupportedCauses, setFilterBySupportedCauses] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Mouse tracking effect - adding from FindYourPassion
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

  // All existing useEffect hooks and functions remain unchanged
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserProfile();
      if (!userData.error) {
        setUser(userData);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSupportedCauses = async () => {
      const causes = await getSupportedCauses();
      if (!causes.error) {
        setSupportedCauses(causes);
      }
    };

    if (user) {
      fetchSupportedCauses();
    }
  }, [user]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, selectedCategory, activeTab, pagination.currentPage, showOnlyMyItems, filterBySupportedCauses]);

  // All other functions remain the same - fetchData, handleTabChange, handleCategoryChange, etc.
  // ... (all other existing functions remain unchanged)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 text-white pt-20">
      {/* Background Elements - Matching FindYourPassion style */}
      <div className="absolute inset-0 top-20 z-0 pointer-events-none">
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
            x: mousePosition.x * window.innerWidth - 300,
            y: mousePosition.y * window.innerHeight - 300,
          }}
          transition={{
            type: "spring",
            stiffness: 10,
            damping: 50,
            mass: 3,
          }}
        />
      </div>

      {/* Hero Section - Redesigned to match FindYourPassion */}
      <div className="relative bg-gradient-to-r from-indigo-900/70 to-purple-900/70 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:14px_24px]" />
        <motion.div
          className="relative max-w-7xl mx-auto px-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Customized badge matching FindYourPassion style */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <span className="text-indigo-300 text-sm font-medium">Action Hub</span>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Turn Your Passion Into <span className="text-indigo-400">Action</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Find resources, connect with organizations, and access opportunities to make a meaningful impact.
            </motion.p>

            {/* Search Bar with updated styling */}
            <motion.div
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search for organizations, resources, or opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/60" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content - All existing content remains the same */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl flex items-center gap-2">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {/* Top Controls Row */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          {/* Category Filters */}
          <div className="flex-grow mr-4 mb-4 md:mb-0">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
              {categories.slice(0, 6).map((category) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategory === category.toLowerCase()
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-white/5 hover:bg-white/10"
                  } transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}

              {/* More categories dropdown */}
              {categories.length > 6 && (
                <div className="relative">
                  {moreMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)}></div>}

                  {moreMenuOpen && (
                    <div
                      className="absolute z-50 bg-slate-800 shadow-xl rounded-lg p-2 border border-slate-700"
                      style={{
                        width: "200px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        right: 0,
                        top: "100%",
                        marginTop: "8px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                      }}
                    >
                      {categories.slice(6).map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            handleCategoryChange(category);
                            setMoreMenuOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded my-1 ${
                            selectedCategory === category.toLowerCase()
                              ? "bg-indigo-500 text-white"
                              : "hover:bg-white/5"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Button */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              <span className="hidden sm:inline">Add</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs with updated styling to match FindYourPassion */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: "organizations", icon: FaUsers, label: "Organizations" },
            { id: "resources", icon: FaBookOpen, label: "Resources" },
            { id: "opportunities", icon: FaGraduationCap, label: "Opportunities" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                activeTab === tab.id ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-white/5 hover:bg-white/10"
              } transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* The rest of the content remains unchanged */}
        {/* ... remainder of the component with all existing functionality ... */}
      </div>

      {/* All modals remain unchanged */}
      {/* ... all modal code remains the same ... */}
    </div>
  );
};

export default ActionHub;
