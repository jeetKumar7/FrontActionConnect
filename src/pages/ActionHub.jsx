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
  // State variables for data
  const [organizations, setOrganizations] = useState([]);
  const [resources, setResources] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState("organizations");

  // UI state variables
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

  // User state
  const [user, setUser] = useState(null);
  const [showOnlyMyItems, setShowOnlyMyItems] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
  });

  // Add these states
  const [supportedCauses, setSupportedCauses] = useState([]);
  const [filterBySupportedCauses, setFilterBySupportedCauses] = useState(false);

  // Add this state
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Get user info on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserProfile();
      if (!userData.error) {
        setUser(userData);
      }
    };

    fetchUserData();
  }, []);

  // Add this effect to fetch supported causes
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

  // Function to handle search with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, selectedCategory, activeTab, pagination.currentPage, showOnlyMyItems, filterBySupportedCauses]);

  // Updated fetchData function with simplified approach
  const fetchData = async () => {
    setLoading(true);
    setError("");

    // Simple filters object
    const filters = {
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      search: searchQuery,
      page: pagination.currentPage,
    };

    if (showOnlyMyItems) {
      // Get user ID directly from localStorage as a fallback
      const userId = user?._id || localStorage.getItem("userId");

      if (userId) {
        filters.createdBy = userId;
        console.log("Filtering by user ID:", userId);
      } else {
        console.warn("User ID not available for filtering");
        setError("Please log in to view your items");
        setLoading(false);
        return;
      }
    }

    console.log("Fetching with filters:", filters);

    try {
      let response;

      switch (activeTab) {
        case "organizations":
          response = await getOrganizations(filters);
          if (response.error) {
            setError(response.error);
          } else {
            console.log("Organizations data received:", response.organizations);

            // Force the state to update with a new array
            setOrganizations([...(response.organizations || [])]);

            if (response.pagination) {
              setPagination({
                totalItems: response.pagination.totalItems,
                totalPages: response.pagination.totalPages,
                currentPage: response.pagination.currentPage,
                itemsPerPage: response.pagination.itemsPerPage,
              });
            }
          }
          break;

        case "resources":
          response = await getResources(filters);
          if (response.error) {
            setError(response.error);
          } else {
            console.log("Resources data received:", response.resources);

            // Force the state to update with a new array
            setResources([...(response.resources || [])]);

            if (response.pagination) {
              setPagination({
                totalItems: response.pagination.totalItems,
                totalPages: response.pagination.totalPages,
                currentPage: response.pagination.currentPage,
                itemsPerPage: response.pagination.itemsPerPage,
              });
            }
          }
          break;

        case "opportunities":
          response = await getOpportunities(filters);
          if (response.error) {
            setError(response.error);
          } else {
            console.log("Opportunities data received:", response.opportunities);

            // Force the state to update with a new array
            setOpportunities([...(response.opportunities || [])]);

            if (response.pagination) {
              setPagination({
                totalItems: response.pagination.totalItems,
                totalPages: response.pagination.totalPages,
                currentPage: response.pagination.currentPage,
                itemsPerPage: response.pagination.itemsPerPage,
              });
            }
          }
          break;
      }

      // Add a more visible indicator for the user about the filter state
      if (showOnlyMyItems) {
        document.title = "My Items - ActionConnect";
      } else {
        document.title = "ActionHub - ActionConnect";
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when changing tabs
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when changing category
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when searching
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  // Open form modal
  const openModal = () => {
    // Initialize form based on active tab
    let initialFormData = {};

    switch (activeTab) {
      case "organizations":
        initialFormData = {
          name: "",
          description: "",
          website: "",
          location: "Global",
          rating: 0,
          opportunities: ["Volunteer"],
        };
        break;

      case "resources":
        initialFormData = {
          title: "",
          description: "",
          type: "Article",
          provider: "",
          url: "",
          price: "Free",
        };
        break;

      case "opportunities":
        initialFormData = {
          title: "",
          description: "",
          organization: "",
          location: "Remote",
          applicationUrl: "",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        };
        break;
    }

    setFormData(initialFormData);
    setSelectedCategories([]);
    setImageFile(null);
    setImagePreview(null);
    setFormError("");
    setSubmitSuccess(false);
    setIsModalOpen(true);
  };

  // Close form modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Update the handleImageUpload function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validations remain the same...

    setSubmitting(true);
    setFormError("");

    try {
      // Show immediate preview for better UX
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const response = await uploadImage(file);

      console.log("Cloudinary response:", response);

      if (response.error) {
        setFormError(response.error);
        setImagePreview(null);
      } else {
        // IMPORTANT: Explicitly update formData with the image URL
        setFormData({
          ...formData,
          imageUrl: response.imageUrl,
          image: response.imageUrl,
        });
        console.log("Image URL set to:", response.imageUrl);

        // Log for debugging
        console.log("Image URL set to:", response.imageUrl);
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setFormError("Failed to upload image. Please try again.");
      setImagePreview(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle opportunity checkbox changes
  const handleOpportunityChange = (type) => {
    const currentOpportunities = formData.opportunities || [];

    if (currentOpportunities.includes(type)) {
      setFormData({
        ...formData,
        opportunities: currentOpportunities.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        opportunities: [...currentOpportunities, type],
      });
    }
  };

  // Fix the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      // Check if we have an image preview but no imageUrl yet
      if (imagePreview && !formData.imageUrl) {
        setFormError("Please wait for image upload to complete");
        setSubmitting(false);
        return;
      }

      // Basic validation based on active tab
      if (activeTab === "organizations") {
        if (!formData.name || !formData.description) {
          setFormError("Please fill in all required fields");
          setSubmitting(false);
          return;
        }
      } else if (activeTab === "resources") {
        if (!formData.title || !formData.type || !formData.url) {
          setFormError("Please fill in all required fields");
          setSubmitting(false);
          return;
        }
      } else if (activeTab === "opportunities") {
        if (!formData.title || !formData.organization || !formData.applicationUrl) {
          setFormError("Please fill in all required fields");
          setSubmitting(false);
          return;
        }
      }

      // Ensure a category is selected
      if (!selectedCategories.length) {
        setFormError("Please select at least one category");
        setSubmitting(false);
        return;
      }

      // Create submission data with primary category
      const submitData = {
        ...formData,
        // Use imageUrl as the image field expected by backend
        image: formData.imageUrl,
        // Use the first category as the main category
        category: selectedCategories[0],
        categories: selectedCategories,
      };

      // Log the exact data being sent (for debugging)
      console.log("Submitting with image URL:", submitData.imageUrl);

      let response;
      switch (activeTab) {
        case "organizations":
          response = await createOrganization(submitData);
          break;
        case "resources":
          response = await createResource(submitData);
          break;
        case "opportunities":
          response = await createOpportunity(submitData);
          break;
      }

      console.log("Server response:", response);

      if (response.error) {
        setFormError(response.error || "Submission failed");
      } else {
        setSubmitSuccess(true);
        setTimeout(() => {
          fetchData();
          setIsModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setFormError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const confirmDelete = (type, id) => {
    setDeleteConfirmation({ type, id });
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Simplified delete handling
  const executeDelete = async () => {
    if (!deleteConfirmation) return;

    const { type, id } = deleteConfirmation;

    try {
      const response = await deleteItem(type, id);

      if (!response.success) {
        setError(response.error);
      } else {
        // Update UI by removing deleted item
        switch (type) {
          case "organizations":
            setOrganizations(organizations.filter((item) => item._id !== id));
            break;
          case "resources":
            setResources(resources.filter((item) => item._id !== id));
            break;
          case "opportunities":
            setOpportunities(opportunities.filter((item) => item._id !== id));
            break;
        }
        setDeleteConfirmation(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete item. Please try again.");
    }
  };

  // Check if user can edit an item
  const canEditItem = (item) => {
    return user && (user._id === item.createdBy || user.role === "admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-[var(--text-primary)] pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16 overflow-hidden">
        {/* Background Video */}
        <video className="absolute inset-0 w-full h-full object-cover opacity-80" autoPlay loop muted playsInline>
          <source
            src="https://res.cloudinary.com/dak1w5wyf/video/upload/v1745846757/3129671-uhd_3840_2160_30fps_1_efxoei.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Turn Your Passion Into Action
            </motion.h1>
            <motion.p
              className="text-xl text-[var(--text-primary)]/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Find resources, connect with organizations, and access opportunities to make a meaningful impact.
            </motion.p>

            {/* Search Bar */}
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
                onChange={handleSearchChange}
                className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-[var(--text-primary)] placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[var(--text-primary)]/60" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
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
                  {/* Invisible overlay to capture clicks outside */}
                  {moreMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)}></div>}

                  {/* Dropdown menu with absolute position instead of fixed */}
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
                              ? "bg-blue-500 text-[var(--text-primary)]"
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

          {/* My Items Toggle & Add Button */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              <span className="hidden sm:inline">Add</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
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
                activeTab === tab.id ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-white/5 hover:bg-white/10"
              } transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-3xl text-blue-500 mr-3" />
            <span className="text-[var(--text-primary)]/70 text-lg">Loading...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          ((activeTab === "organizations" && organizations.length === 0) ||
            (activeTab === "resources" && resources.length === 0) ||
            (activeTab === "opportunities" && opportunities.length === 0)) && (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <div className="text-6xl mb-4 text-[var(--text-primary)]/20 flex justify-center">
                {activeTab === "organizations" ? (
                  <FaUsers />
                ) : activeTab === "resources" ? (
                  <FaBookOpen />
                ) : (
                  <FaGraduationCap />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">No {activeTab} found</h3>
              <p className="text-[var(--text-primary)]/60 max-w-md mx-auto">
                {searchQuery ? `No results for "${searchQuery}"` : `There are currently no ${activeTab} available.`}
                {selectedCategory !== "all" && ` Try changing the category filter.`}
                {showOnlyMyItems && ` You haven't created any ${activeTab} yet.`}
              </p>
              <button
                onClick={openModal}
                className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg inline-flex items-center gap-2"
              >
                <FaPlus />
                <span>
                  Create{" "}
                  {activeTab === "organizations"
                    ? "an Organization"
                    : activeTab === "resources"
                    ? "a Resource"
                    : "an Opportunity"}
                </span>
              </button>
            </div>
          )}

        {/* Content Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Organizations Tab */}
            {activeTab === "organizations" &&
              organizations.map((org) => (
                <motion.div
                  key={org._id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 relative"
                  whileHover={{ y: -5 }}
                >
                  {/* Edit/Delete Controls */}
                  {canEditItem(org) && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => confirmDelete("organizations", org._id)}
                        className="p-2 bg-red-600/70 hover:bg-red-600 rounded-full"
                        title="Delete Organization"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}

                  {/* Add this debug log */}
                  {console.log("Organization image URL:", org.imageUrl)}

                  <img
                    src={org.image || org.imageUrl || "https://via.placeholder.com/500x300?text=Organization"}
                    alt={org.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", org.image);
                      e.target.src = "https://via.placeholder.com/500x300?text=Organization";
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{org.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {org.categories &&
                            org.categories.map((category, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                                {category}
                              </span>
                            ))}
                        </div>
                      </div>
                      {org.rating && Number(org.rating) > 0 && (
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          <span>{org.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[var(--text-primary)]/80 mb-4 line-clamp-2">{org.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {org.opportunities &&
                        org.opportunities.map((opp, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10">
                            {opp}
                          </span>
                        ))}
                    </div>
                    <motion.a
                      href={org.website || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Website <FaArrowRight />
                    </motion.a>
                  </div>
                </motion.div>
              ))}

            {/* Resources Tab */}
            {activeTab === "resources" &&
              resources.map((resource) => (
                <motion.div
                  key={resource._id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative"
                  whileHover={{ y: -5 }}
                >
                  {/* Edit/Delete Controls */}
                  {canEditItem(resource) && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => confirmDelete("resources", resource._id)}
                        className="p-2 bg-red-600/70 hover:bg-red-600 rounded-full"
                        title="Delete Resource"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <div className="flex items-center gap-4 text-[var(--text-primary)]/60 text-sm mb-2">
                    <span>{resource.type}</span>
                    {resource.provider && (
                      <>
                        <span>•</span>
                        <span>{resource.provider}</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.categories &&
                      resource.categories.map((category, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">
                          {category}
                        </span>
                      ))}
                  </div>

                  <p className="text-[var(--text-primary)]/80 mb-4 line-clamp-3">{resource.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400">{resource.price || "Free"}</span>
                    <motion.a
                      href={resource.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Access Resource
                    </motion.a>
                  </div>
                </motion.div>
              ))}

            {/* Opportunities Tab */}
            {activeTab === "opportunities" &&
              opportunities.map((opportunity) => (
                <motion.div
                  key={opportunity._id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative"
                  whileHover={{ y: -5 }}
                >
                  {/* Edit/Delete Controls */}
                  {canEditItem(opportunity) && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => confirmDelete("opportunities", opportunity._id)}
                        className="p-2 bg-red-600/70 hover:bg-red-600 rounded-full"
                        title="Delete Opportunity"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                  <p className="text-[var(--text-primary)]/60 mb-2">{opportunity.organization}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {opportunity.categories &&
                      opportunity.categories.map((category, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {category}
                        </span>
                      ))}
                  </div>

                  <p className="text-[var(--text-primary)]/80 mb-4 line-clamp-2">{opportunity.description}</p>

                  <div className="space-y-2 mb-4">
                    {opportunity.amount && (
                      <div className="flex items-center gap-2 text-green-400">
                        <FaDollarSign />
                        <span>{opportunity.amount}</span>
                      </div>
                    )}
                    {opportunity.deadline && (
                      <div className="flex items-center gap-2 text-[var(--text-primary)]/60">
                        <FaRegCalendarCheck />
                        <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {opportunity.location && (
                      <div className="flex items-center gap-2 text-[var(--text-primary)]/60">
                        <FaGlobe />
                        <span>{opportunity.location}</span>
                      </div>
                    )}
                  </div>
                  <motion.a
                    href={opportunity.url || opportunity.applicationUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now <FaArrowRight />
                  </motion.a>
                </motion.div>
              ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-1 rounded ${
                  pagination.currentPage === 1
                    ? "bg-white/5 text-[var(--text-primary)]/40 cursor-not-allowed"
                    : "bg-white/10 text-[var(--text-primary)] hover:bg-white/20"
                }`}
              >
                &laquo; Previous
              </button>

              <div className="flex gap-1">
                {[...Array(pagination.totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`w-8 h-8 rounded-full ${
                      pagination.currentPage === page + 1
                        ? "bg-blue-500 text-[var(--text-primary)]"
                        : "bg-white/10 text-[var(--text-primary)] hover:bg-white/20"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-1 rounded ${
                  pagination.currentPage === pagination.totalPages
                    ? "bg-white/5 text-[var(--text-primary)]/40 cursor-not-allowed"
                    : "bg-white/10 text-[var(--text-primary)] hover:bg-white/20"
                }`}
              >
                Next &raquo;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submission Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div
              className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-center border-b border-slate-700 p-4 sticky top-0 bg-slate-800 z-10">
                <h3 className="text-xl font-semibold">
                  {activeTab === "organizations"
                    ? "Add Organization"
                    : activeTab === "resources"
                    ? "Add Resource"
                    : "Add Opportunity"}
                </h3>
                <button className="text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {/* Success Message */}
                {submitSuccess && (
                  <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg flex items-center gap-2">
                    <FaCheck />
                    <span>Successfully added! Redirecting...</span>
                  </div>
                )}

                {/* Error Message */}
                {formError && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-2">
                    <FaExclamationTriangle />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Organization Form */}
                  {activeTab === "organizations" && (
                    <>
                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Organization Name*</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Description*</label>
                        <textarea
                          name="description"
                          value={formData.description || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Website URL</label>
                        <div className="flex items-center">
                          <FaLink className="text-slate-400 mr-2" />
                          <input
                            type="url"
                            name="website"
                            value={formData.website || ""}
                            onChange={handleInputChange}
                            placeholder="https://example.org"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[var(--text-primary)]/80 mb-2">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleInputChange}
                            placeholder="City, Country or Global"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[var(--text-primary)]/80 mb-2">Rating (0-5)</label>
                          <div className="flex items-center gap-3">
                            {[0, 1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: value })}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                  Number(formData.rating) === value
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-[var(--text-primary)]"
                                    : "bg-slate-700 hover:bg-slate-600 text-[var(--text-primary)]/70"
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">
                            {Number(formData.rating) === 0 ? "No rating" : `Rated ${formData.rating} out of 5`}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Image (Optional)</label>
                        {!imagePreview ? (
                          <div
                            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50"
                            onClick={() => document.getElementById("org-image").click()}
                          >
                            <FaUpload className="mx-auto text-2xl mb-2 text-slate-400" />
                            <p className="text-slate-400">Click to upload an image</p>
                            <input
                              type="file"
                              id="org-image"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-[var(--text-primary)] p-1 rounded-full"
                              title="Remove Image"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Opportunities</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Volunteer", "Donate", "Internship", "Job", "Research", "Advocacy"].map((item) => (
                            <label key={item} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={(formData.opportunities || []).includes(item)}
                                onChange={() => handleOpportunityChange(item)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Resource Form */}
                  {activeTab === "resources" && (
                    <>
                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Resource Title*</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Resource Type*</label>
                        <select
                          name="type"
                          value={formData.type || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        >
                          <option value="Article">Article</option>
                          <option value="Book">Book</option>
                          <option value="Course">Course</option>
                          <option value="Guide">Guide</option>
                          <option value="Report">Report</option>
                          <option value="Tool">Tool</option>
                          <option value="Video">Video</option>
                          <option value="Website">Website</option>
                          <option value="Webinar">Webinar</option>
                          <option value="Podcast">Podcast</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Description</label>
                        <textarea
                          name="description"
                          value={formData.description || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Provider/Author</label>
                        <input
                          type="text"
                          name="provider"
                          value={formData.provider || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Resource URL*</label>
                        <div className="flex items-center">
                          <FaLink className="text-slate-400 mr-2" />
                          <input
                            type="url"
                            name="url"
                            value={formData.url || ""}
                            onChange={handleInputChange}
                            placeholder="https://example.org/resource"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Price/Access Type</label>
                        <select
                          name="price"
                          value={formData.price || "Free"}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="Free">Free</option>
                          <option value="Paid">Paid</option>
                          <option value="Freemium">Freemium</option>
                          <option value="Donation">Donation-based</option>
                          <option value="Subscription">Subscription</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Opportunity Form */}
                  {activeTab === "opportunities" && (
                    <>
                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Opportunity Title*</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Organization*</label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Description</label>
                        <textarea
                          name="description"
                          value={formData.description || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Application URL*</label>
                        <div className="flex items-center">
                          <FaLink className="text-slate-400 mr-2" />
                          <input
                            type="url"
                            name="applicationUrl"
                            value={formData.applicationUrl || ""}
                            onChange={handleInputChange}
                            placeholder="https://example.org/apply"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[var(--text-primary)]/80 mb-2">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleInputChange}
                            placeholder="City, Country or Remote"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[var(--text-primary)]/80 mb-2">Amount/Compensation</label>
                          <input
                            type="text"
                            name="amount"
                            value={formData.amount || ""}
                            onChange={handleInputChange}
                            placeholder="e.g. $5,000 or Volunteer"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[var(--text-primary)]/80 mb-2">Deadline (if applicable)</label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                    </>
                  )}

                  {/* Categories - common for all types */}
                  <div>
                    <label className="block text-[var(--text-primary)]/80 mb-2">
                      Categories* <span className="text-slate-400 text-sm">(Select at least one)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-700/30 rounded-lg">
                      {categories
                        .filter((cat) => cat !== "All")
                        .map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedCategories.includes(category)
                                ? "bg-blue-500 text-[var(--text-primary)]"
                                : "bg-slate-700 text-[var(--text-primary)]/70 hover:bg-slate-600"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                    </div>
                    {selectedCategories.length === 0 && (
                      <p className="text-amber-400 text-sm mt-1">
                        <FaInfoCircle className="inline mr-1" />
                        Please select at least one category
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || submitSuccess}
                      className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                        submitting || submitSuccess
                          ? "bg-blue-500/50 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : submitSuccess ? (
                        <>
                          <FaCheck />
                          Success!
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div
              className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-6">
                  Are you sure you want to delete this {deleteConfirmation.type.slice(0, -1)}? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button onClick={cancelDelete} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                    Cancel
                  </button>
                  <button onClick={executeDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionHub;
