import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaLeaf,
  FaWater,
  FaTree,
  FaSeedling,
  FaSearch,
  FaUserFriends,
  FaCompressArrowsAlt,
  FaExpandArrowsAlt,
  FaClock,
  FaPlus,
  FaCalendarAlt,
  FaChevronDown,
  FaLocationArrow,
  FaHome,
  FaUsers,
  FaUser,
  FaSpinner,
  FaBars,
  FaTimes,
  FaFilter,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getUserProfile,
  getSupportedCauses,
  getUsersByCause,
  getInitiatives,
  joinInitiative,
  createInitiative,
  deleteInitiative,
} from "../services";
import { causes } from "../data/causes";
import { Link } from "react-router-dom";

// Error boundary for handling React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/50 text-[var(--text-primary)]">
          <h3 className="font-bold mb-2">Something went wrong</h3>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onClose?.();
            }}
            className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Fix for marker icons in production
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon creator
const createCustomIcon = (iconColor = "blue") => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// User location and other user icons
const userLocationIcon = createCustomIcon("green");
const otherUserIcon = createCustomIcon("violet");

// Component to handle map view changes
function FlyToMarker({ position, flyToCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (position && flyToCoordinates && map) {
      map.flyTo([position.lat, position.lng], 14, {
        animate: true,
        duration: 0.7,
      });
    }
  }, [position, flyToCoordinates, map]);

  return null;
}

// Geocode function to convert address to coordinates
const geocodeLocation = async (locationString) => {
  if (!locationString) return null;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const categories = [
  "All",
  "Urban Farming",
  "Ocean Conservation",
  "Reforestation",
  "Waste Management",
  "Renewable Energy",
  "Wildlife Protection",
  "Community Building",
  "Education",
  "Health",
  "Sustainable Living",
  "Climate Action",
  "Biodiversity",
  "Food Security",
  "Water Conservation",
  "Air Quality",
  "Pollution Control",
  "Green Technology",
  "Sustainable Transportation",
  "Environmental Justice",
  "Sustainable Agriculture",
  "Ecosystem Restoration",
  "Plastic Pollution",
];

const InteractiveMap = () => {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [showInitiatives, setShowInitiatives] = useState(true);

  // Add to existing state variables in InteractiveMap
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingInitiative, setIsDeletingInitiative] = useState(false);

  // Map state
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]); // Default: NYC
  const [mapZoom, setMapZoom] = useState(11);

  // User related state
  const [userData, setUserData] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [isLoadingUserLocation, setIsLoadingUserLocation] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [flyToCoordinates, setFlyToCoordinates] = useState(false);
  const [supportedCauses, setSupportedCauses] = useState([]);
  const [highlightSupported, setHighlightSupported] = useState(false);

  // User discovery states
  const [showPeopleTab, setShowPeopleTab] = useState(false);
  const [selectedCauseFilter, setSelectedCauseFilter] = useState("");
  const [usersWithCause, setUsersWithCause] = useState([]);
  const [userCoordinatesMap, setUserCoordinatesMap] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [flyToUser, setFlyToUser] = useState(null);

  // Initiatives state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryInput, setCategoryInput] = useState("");
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Add initiative modal state
  const [showAddInitiativeModal, setShowAddInitiativeModal] = useState(false);
  const [isOverlayMinimized, setIsOverlayMinimized] = useState(false);

  const [newInitiative, setNewInitiative] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    tagsInput: "",
    website: "",
    status: "Upcoming",
    nextEvent: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // References
  const isInitiativesFiltered = useRef(false);
  const mapRef = useRef(null);

  // Add new state for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Map controller component to access map instance
  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      if (map) mapRef.current = map;
    }, [map]);
    return null;
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const userData = await getUserProfile();

        if (!userData.error) {
          setUserData(userData);

          if (userData.location) {
            setIsLoadingUserLocation(true);
            const coordinates = await geocodeLocation(userData.location);
            setIsLoadingUserLocation(false);

            if (coordinates) setUserCoordinates(coordinates);
          }

          const causes = await getSupportedCauses();
          if (!causes.error) setSupportedCauses(causes);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  // Center map on user location
  const centerOnUserLocation = useCallback(() => {
    if (userCoordinates && mapRef.current) {
      mapRef.current.flyTo([userCoordinates.lat, userCoordinates.lng], 13);
      setShowUserLocation(true);
    }
  }, [userCoordinates]);

  // Fetch users by selected cause
  const fetchUsersByCause = async (causeId) => {
    if (!causeId) return;

    setLoadingUsers(true);
    try {
      const result = await getUsersByCause(causeId);
      if (!result.error) {
        setUsersWithCause(result);

        const coordinatesMap = {};
        for (const user of result) {
          if (user.location) {
            const coords = await geocodeLocation(user.location);
            if (coords) coordinatesMap[user._id] = coords;
          }
        }
        setUserCoordinatesMap(coordinatesMap);
      }
    } catch (error) {
      console.error("Error fetching users by cause:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Add with other handler functions
  const handleDeleteInitiative = async () => {
    if (!selectedInitiative || !userData) {
      setError("Cannot delete initiative");
      return;
    }

    setIsDeletingInitiative(true);
    try {
      const result = await deleteInitiative(selectedInitiative._id);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Initiative deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        setSelectedInitiative(null);
        fetchInitiatives(); // Refresh the initiatives list
      }
    } catch (error) {
      console.error("Error deleting initiative:", error);
      setError("Failed to delete initiative. Please try again.");
    } finally {
      setIsDeletingInitiative(false);
      setShowDeleteConfirm(false);
    }
  };

  // Fetch users when cause filter changes
  useEffect(() => {
    if (selectedCauseFilter) fetchUsersByCause(selectedCauseFilter);
  }, [selectedCauseFilter]);

  // Handle selecting a user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedInitiative(null);

    if (userCoordinatesMap[user._id]) {
      setFlyToUser({
        coordinates: userCoordinatesMap[user._id],
        userId: user._id,
      });

      setTimeout(() => setFlyToUser(null), 100);
    }
  };

  // Handle form input changes
  const handleInitiativeFormChange = (e) => {
    const { name, value } = e.target;
    setNewInitiative((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleAddInitiative = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const tags = newInitiative.tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const initiativeData = {
        ...newInitiative,

        tags,
        organizer: userData?.name || "Anonymous",
        nextEvent: newInitiative.nextEvent, // Make sure to send nextEvent
      };

      // Remove tagsInput from data sent to server
      delete initiativeData.tagsInput;

      const result = await createInitiative(initiativeData);

      if (result && result.error) {
        setFormError(result.error);
      } else if (result) {
        setShowAddInitiativeModal(false);

        setTimeout(() => {
          setSuccess("Initiative created successfully!");
          setNewInitiative({
            title: "",
            category: "",
            description: "",
            location: "",
            tagsInput: "",
            website: "",
            status: "Upcoming",
            nextEvent: new Date().toISOString().split("T")[0],
          });
          fetchInitiatives();
        }, 100);
      } else {
        setFormError("An unknown error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Create initiative error:", error);
      setFormError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch initiatives helper
  const fetchInitiatives = async () => {
    const initiativesData = await getInitiatives();
    if (!initiativesData.error) {
      const initiativesWithCoordinates = await Promise.all(
        initiativesData.map(async (initiative) => {
          const coords = await geocodeLocation(initiative.location);
          return {
            ...initiative,
            coordinates: coords || { lat: 0, lng: 0 },
            icon: FaMapMarkerAlt,
          };
        })
      );
      setInitiatives(initiativesWithCoordinates);
    }
  };

  // Fetch initiatives on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchInitiatives();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Add this function to handle category input
  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);

    // Filter categories based on input
    const filtered = categories
      .filter((cat) => cat !== "All")
      .filter((cat) => cat.toLowerCase().includes(value.toLowerCase()));

    setFilteredCategories(filtered);
    setShowCategorySuggestions(true);

    // Update the initiative form state
    setNewInitiative((prev) => ({
      ...prev,
      category: value,
    }));
  };

  // Add this function to handle category selection from dropdown
  const handleCategorySelect = (category) => {
    setCategoryInput(category);
    setNewInitiative((prev) => ({
      ...prev,
      category,
    }));
    setShowCategorySuggestions(false);
  };

  // Filter initiatives based on search and category
  const filteredInitiatives = initiatives.filter(
    (initiative) =>
      (selectedCategory === "All" || initiative.category === selectedCategory) &&
      (initiative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        initiative.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle join initiative button click
  const handleJoinInitiative = async (initiative) => {
    const result = await joinInitiative(initiative._id);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(null), 1500);

      if (result.redirectUrl) {
        window.open(result.redirectUrl, "_blank");
      }
    } else {
      setError(result.error);
      setTimeout(() => setError(null), 3000);

      if (result.redirectUrl) {
        window.open(result.redirectUrl, "_blank");
      }
    }
  };

  // Calculate map center based on initiatives
  useEffect(() => {
    if (filteredInitiatives.length > 0 && !selectedInitiative && !isInitiativesFiltered.current) {
      isInitiativesFiltered.current = true;

      const lats = filteredInitiatives.map((i) => i.coordinates.lat);
      const lngs = filteredInitiatives.map((i) => i.coordinates.lng);
      const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

      setMapCenter([centerLat, centerLng]);
      setMapZoom(filteredInitiatives.length === 1 ? 14 : 11);
    }
  }, [filteredInitiatives, selectedInitiative]);

  // Reset filtering flag when filters change
  useEffect(() => {
    isInitiativesFiltered.current = false;
  }, [selectedCategory, searchQuery]);

  // Handle selecting an initiative
  const handleSelectInitiative = (initiative) => {
    setSelectedInitiative(initiative);
    setSelectedUser(null);
    setFlyToCoordinates(true);
    setTimeout(() => setFlyToCoordinates(false), 100);
  };

  // Render map markers for initiatives
  const renderInitiativeMarkers = () => {
    return filteredInitiatives.map((initiative) => {
      if (!initiative.coordinates || !initiative.coordinates.lat || !initiative.coordinates.lng) {
        return null;
      }

      const iconColor = selectedInitiative?._id === initiative._id ? "red" : "blue";

      return (
        <Marker
          key={initiative._id}
          position={[initiative.coordinates.lat, initiative.coordinates.lng]}
          icon={createCustomIcon(iconColor)}
          eventHandlers={{ click: () => handleSelectInitiative(initiative) }}
        >
          <Popup>
            <div className="text-black">
              <h3 className="font-semibold">{initiative.title}</h3>
              <p className="text-sm">{initiative.category}</p>
              <p className="text-xs mt-1">{initiative.location}</p>
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  // Render markers for users
  const renderUserMarkers = () => {
    return usersWithCause.map((user) => {
      const userCoords = userCoordinatesMap[user._id];
      if (!userCoords) return null;

      return (
        <Marker
          key={user._id}
          position={[userCoords.lat, userCoords.lng]}
          icon={otherUserIcon}
          eventHandlers={{ click: () => handleSelectUser(user) }}
        >
          <Popup>
            <div className="text-black">
              <h3 className="font-semibold">{user.name}</h3>
              {user.location && <p className="text-sm">{user.location}</p>}
              <div className="mt-2">
                <button
                  className="bg-blue-500 text-[var(--text-primary)] text-xs px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectUser(user);
                  }}
                >
                  View Profile
                </button>
              </div>
              {/* Connect Button */}
              {user.email && (
                <div className="mt-2">
                  <a
                    href={`mailto:${user.email}`}
                    className="bg-green-500 text-[var(--text-primary)] text-xs px-2 py-1 rounded hover:bg-green-600"
                  >
                    Connect
                  </a>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  // Modified layout structure - Top Control Bar and Sidebar positioning

  return (
    <div className="h-screen w-full bg-slate-900 text-[var(--text-primary)] pt-16 relative overflow-hidden">
      {/* Notifications stay the same */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-500 text-[var(--text-primary)] px-4 py-2 rounded shadow-lg z-50">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-green-500 text-[var(--text-primary)] px-4 py-2 rounded shadow-lg z-50">
          {success}
        </div>
      )}
      {/* Full Screen Map */}
      <div className="absolute inset-0 pt-16 z-0">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }} className="z-0">
          <MapController />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Map markers and other elements remain the same */}
          {!showPeopleTab ? renderInitiativeMarkers() : renderUserMarkers()}

          {/* User location marker */}
          {showUserLocation && userCoordinates && (
            <Marker position={[userCoordinates.lat, userCoordinates.lng]} icon={userLocationIcon}>
              <Popup>
                <div className="text-black">
                  <h3 className="font-semibold">Your Location</h3>
                  <p className="text-sm">{userData?.location}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Fly to handlers */}
          {selectedInitiative && flyToCoordinates && (
            <FlyToMarker position={selectedInitiative.coordinates} flyToCoordinates={flyToCoordinates} />
          )}
          {flyToUser && <FlyToMarker position={flyToUser.coordinates} flyToCoordinates={true} />}
        </MapContainer>
      </div>
      {/* Top Control Bar - Full width spanning the top */}
      <div className="absolute top-18 left-0 right-0 z-30 bg-[var(--bg-secondary)]/90 backdrop-blur-md border-b border-white/10">
        <div className="flex flex-wrap items-center p-2 md:p-3 gap-2">
          {/* Toggle sidebar button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-700/80 hover:bg-slate-600/80 rounded-lg"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Search - Full width */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={showPeopleTab ? "Search people..." : "Search initiatives..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-white/40 focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-primary)]/40" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Toggle Initiatives/People */}
            <div className="flex rounded-lg overflow-hidden border border-white/10 bg-slate-700/50">
              <button
                onClick={() => setShowPeopleTab(false)}
                className={`px-3 py-1.5 flex items-center gap-2 text-sm ${
                  !showPeopleTab ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-transparent hover:bg-white/10"
                }`}
              >
                <FaMapMarkerAlt className="w-3 h-3" />
                <span>Initiatives</span>
              </button>
              <button
                onClick={() => setShowPeopleTab(true)}
                className={`px-3 py-1.5 flex items-center gap-2 text-sm ${
                  showPeopleTab ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-transparent hover:bg-white/10"
                }`}
              >
                <FaUsers className="w-3 h-3" />
                <span>People</span>
              </button>
            </div>

            {/* User Location Button */}
            {userCoordinates && (
              <motion.button
                onClick={centerOnUserLocation}
                className="px-3 py-1.5 flex items-center gap-2 bg-green-600/80 hover:bg-green-700/80 transition-colors rounded-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome className="w-3 h-3" />
                <span className="hidden sm:inline">My Location</span>
              </motion.button>
            )}

            {/* Create initiative button */}
            {userData && (
              <motion.button
                onClick={() => setShowAddInitiativeModal(true)}
                className="px-3 py-1.5 flex items-center gap-2 bg-gradient-to-r from-green-500/80 to-teal-500/80 rounded-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus className="w-3 h-3" />
                <span>Add Initiative</span>
              </motion.button>
            )}

            {isLoadingUserLocation && (
              <div className="px-3 py-1.5 text-[var(--text-primary)]/60 text-sm">
                <span className="animate-pulse">Locating...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Collapsible Sidebar - Now positioned below the search bar */}
      <div className="absolute top-[calc(20px+3.5rem)] left-0 bottom-0 z-20 pt-4">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="h-full w-80 lg:w-96 bg-slate-800/90 backdrop-blur-md border-r border-white/10 overflow-hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col h-full">
                {!showPeopleTab ? (
                  /* Initiatives Panel */
                  <>
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">Local Initiatives</h2>
                      </div>

                      {/* Categories filter */}
                      <div className="relative mb-2">
                        <button
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg"
                          onClick={() => setShowInitiatives(!showInitiatives)}
                        >
                          <div className="flex items-center gap-2">
                            <FaFilter className="w-3 h-3" />
                            <span>{selectedCategory}</span>
                          </div>
                          <FaChevronDown
                            className={`transform transition-transform ${showInitiatives ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Categories dropdown */}
                      <AnimatePresence>
                        {showInitiatives && (
                          <motion.div
                            className="overflow-x-auto py-2 scrollbar-none"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="flex flex-wrap gap-2">
                              {categories.map((category) => (
                                <motion.button
                                  key={category}
                                  onClick={() => setSelectedCategory(category)}
                                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm ${
                                    selectedCategory === category
                                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                      : "bg-white/5 hover:bg-white/10"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {category}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Initiatives List */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 grid gap-3">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <FaSpinner className="animate-spin text-3xl text-blue-400" />
                            <p className="text-[var(--text-primary)]/60">Loading initiatives...</p>
                          </div>
                        ) : filteredInitiatives.length > 0 ? (
                          filteredInitiatives.map((initiative) => {
                            if (!initiative.coordinates?.lat) return null;

                            const isRelatedToSupportedCause =
                              highlightSupported &&
                              supportedCauses.some((causeId) => initiative.tags?.includes(causeId));

                            return (
                              <motion.div
                                key={initiative._id}
                                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                  selectedInitiative?._id === initiative._id
                                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50"
                                    : isRelatedToSupportedCause
                                    ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                                onClick={() => handleSelectInitiative(initiative)}
                                whileHover={{ y: -2 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-white/5">
                                    <FaMapMarkerAlt className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold mb-1 text-sm">{initiative.title}</h3>
                                    <p className="text-xs text-[var(--text-primary)]/60 mb-2">{initiative.location}</p>
                                    <div className="text-xs text-[var(--text-primary)]/40">
                                      {initiative.status === "Active" ? (
                                        <span className="text-green-400">Active now</span>
                                      ) : (
                                        <span>
                                          {initiative.nextEvent && !isNaN(new Date(initiative.nextEvent))
                                            ? new Date(initiative.nextEvent).toLocaleDateString()
                                            : "Date not set"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="bg-white/5 rounded-lg p-6 text-center">
                            <FaMapMarkerAlt className="mx-auto text-3xl text-[var(--text-primary)]/30 mb-3" />
                            <p className="text-[var(--text-primary)]/60">No initiatives found matching your search.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* People Panel - IMPLEMENTED */
                  <>
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Find People By Cause</h2>
                      </div>
                      <label className="block text-sm text-[var(--text-primary)]/60 mb-2">Select a cause:</label>
                    </div>

                    {/* Causes list - Scrollable */}
                    <div className="flex-grow overflow-y-auto p-2">
                      <div className="flex flex-wrap gap-2 p-2">
                        {causes.map((cause) => (
                          <motion.button
                            key={cause.id}
                            onClick={() => setSelectedCauseFilter(cause.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              selectedCauseFilter === cause.id
                                ? `bg-${cause.color}-500/30 text-${cause.color}-300 border border-${cause.color}-500/50`
                                : "bg-white/5 hover:bg-white/10 border border-transparent"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <cause.icon className={`w-4 h-4 text-${cause.color}-400`} />
                            <span>{cause.title}</span>
                          </motion.button>
                        ))}
                      </div>

                      {/* People List */}
                      <div className="space-y-3 mt-4 px-2">
                        {loadingUsers ? (
                          <div className="flex justify-center items-center py-8">
                            <FaSpinner className="animate-spin text-2xl text-blue-400" />
                          </div>
                        ) : selectedCauseFilter && usersWithCause.length === 0 ? (
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <FaUsers className="mx-auto text-2xl text-[var(--text-primary)]/30 mb-3" />
                            <p className="text-sm text-[var(--text-primary)]/60">
                              No users found supporting this cause.
                              <br />
                              Be the first to support it!
                            </p>
                          </div>
                        ) : (
                          usersWithCause
                            .filter(
                              (user) =>
                                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                user.location?.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((user) => (
                              <motion.div
                                key={user._id}
                                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                  selectedUser?._id === user._id
                                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                                onClick={() => handleSelectUser(user)}
                                whileHover={{ y: -2 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-violet-500/20">
                                    <FaUser className="w-4 h-4 text-violet-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold mb-1 text-sm">{user.name}</h3>
                                    {user.location && (
                                      <p className="text-xs text-[var(--text-primary)]/60 mb-2">{user.location}</p>
                                    )}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {user.supportedCauses?.slice(0, 2).map((causeId) => {
                                        const cause = causes.find((c) => c.id === causeId);
                                        if (!cause) return null;

                                        return (
                                          <span
                                            key={causeId}
                                            className={`px-2 py-0.5 text-xs rounded-full bg-${cause.color}-500/20 text-${cause.color}-300 border border-${cause.color}-500/30 flex items-center gap-1`}
                                          >
                                            <cause.icon className="w-3 h-3" />
                                            {cause.title}
                                          </span>
                                        );
                                      })}
                                      {user.supportedCauses?.length > 2 && (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-500/20 text-slate-300">
                                          +{user.supportedCauses.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Overlays for initiative details and user profiles remain unchanged */}
      {/* ... */}
      {/* Modals remain unchanged */}
      {/* ... */}
      {/* Add Initiative Modal */}
      {showAddInitiativeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <ErrorBoundary onClose={() => setShowAddInitiativeModal(false)}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Initiative</h2>
                <button
                  onClick={() => setShowAddInitiativeModal(false)}
                  className="text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] text-xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddInitiative} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newInitiative.title}
                    onChange={handleInitiativeFormChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={handleCategoryInputChange}
                      onFocus={() => setShowCategorySuggestions(true)}
                      onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                      placeholder="Select or type a category"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                      required
                    />
                    {showCategorySuggestions && categoryInput && (
                      <div className="absolute z-20 mt-1 w-full bg-slate-700 border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <div
                              key={category}
                              className="px-4 py-2 cursor-pointer hover:bg-slate-600 text-[var(--text-primary)]"
                              onClick={() => handleCategorySelect(category)}
                            >
                              {category}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-[var(--text-primary)]/60 italic">
                            Custom category: "{categoryInput}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={newInitiative.description}
                    onChange={handleInitiativeFormChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newInitiative.location}
                    onChange={handleInitiativeFormChange}
                    placeholder="e.g. New York, NY"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tagsInput"
                    value={newInitiative.tagsInput}
                    onChange={handleInitiativeFormChange}
                    placeholder="e.g. climate, education, community"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={newInitiative.website}
                    onChange={handleInitiativeFormChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={newInitiative.status === "Active"}
                        onChange={handleInitiativeFormChange}
                        className="mr-2"
                      />
                      <span className="text-[var(--text-primary)]/80">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Upcoming"
                        checked={newInitiative.status === "Upcoming"}
                        onChange={handleInitiativeFormChange}
                        className="mr-2"
                      />
                      <span className="text-[var(--text-primary)]/80">Upcoming</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)]/70 mb-1">
                    Next Event Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="nextEvent"
                    value={newInitiative.nextEvent}
                    onChange={handleInitiativeFormChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {formError && (
                  <div className="bg-red-500/30 border border-red-500/50 text-[var(--text-primary)] p-3 rounded-lg">
                    {formError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddInitiativeModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-medium flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Initiative"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </ErrorBoundary>
        </div>
      )}
      {/* Delete Initiative Confirmation Modal */}
      {showDeleteConfirm && selectedInitiative && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-red-500/30 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Delete Initiative</h3>
            <p className="mb-6 text-[var(--text-primary)]/80">
              Are you sure you want to delete <strong>{selectedInitiative.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg"
                disabled={isDeletingInitiative}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInitiative}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center"
                disabled={isDeletingInitiative}
              >
                {isDeletingInitiative ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
