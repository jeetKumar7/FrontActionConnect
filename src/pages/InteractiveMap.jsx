import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaLeaf,
  FaWater,
  FaTree,
  FaSeedling,
  FaSearch,
  FaUserFriends,
  FaClock,
  FaPlus,
  FaCalendarAlt,
  FaChevronDown,
  FaLocationArrow,
  FaHome,
  FaUsers,
  FaUser,
  FaSpinner,
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
        <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/50 text-white">
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

  // Filter initiatives based on search and category
  const filteredInitiatives = initiatives.filter(
    (initiative) =>
      (selectedCategory === "All" || initiative.category === selectedCategory) &&
      initiative.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle join initiative button click
  const handleJoinInitiative = async (initiative) => {
    const result = await joinInitiative(initiative._id);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(null), 3000);

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
                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectUser(user);
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-20">
      {/* Notifications */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">{error}</div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">{success}</div>
      )}

      {/* Header */}
      <div className="bg-slate-900/50 border-b border-white/10 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={showPeopleTab ? "Search people..." : "Search initiatives..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            </div>

            {/* Toggle Initiatives/People */}
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => setShowPeopleTab(false)}
                className={`px-4 py-2 flex items-center gap-2 ${
                  !showPeopleTab ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <FaMapMarkerAlt />
                <span>Initiatives</span>
              </button>
              <button
                onClick={() => setShowPeopleTab(true)}
                className={`px-4 py-2 flex items-center gap-2 ${
                  showPeopleTab ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <FaUsers />
                <span>People</span>
              </button>
            </div>

            {/* User Location Button */}
            {userCoordinates && (
              <motion.button
                onClick={centerOnUserLocation}
                className="px-4 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome />
                <span className="hidden md:inline">My Location</span>
              </motion.button>
            )}
            {isLoadingUserLocation && (
              <div className="px-4 py-2 text-white/60">
                <span className="animate-pulse">Locating...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel (Initiatives or People) */}
          <div className="space-y-4">
            {!showPeopleTab ? (
              /* Initiatives Panel */
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Local Initiatives</h2>
                  <div className="flex items-center gap-2">
                    {userData ? (
                      <motion.button
                        onClick={() => setShowAddInitiativeModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlus className="w-3.5 h-3.5" />
                        <span>Add Initiative</span>
                      </motion.button>
                    ) : (
                      <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
                        Login to create initiatives
                      </Link>
                    )}
                    <motion.button
                      onClick={() => setShowInitiatives(!showInitiatives)}
                      className="lg:hidden p-2 hover:bg-white/5 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaChevronDown
                        className={`transform transition-transform ${showInitiatives ? "rotate-180" : ""}`}
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap ${
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

                {/* Initiatives List */}
                {(showInitiatives || window.innerWidth >= 1024) && (
                  <div className="grid sm:grid-cols-2 gap-4 lg:max-h-[calc(100vh-22rem)] lg:overflow-y-auto scrollbar-none">
                    {loading ? (
                      // Loading animation
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 space-y-3">
                        <FaSpinner className="animate-spin text-3xl text-blue-400" />
                        <p className="text-white/60">Loading initiatives...</p>
                      </div>
                    ) : filteredInitiatives.length > 0 ? (
                      // Map over initiatives when we have data
                      filteredInitiatives.map((initiative) => {
                        if (!initiative.coordinates?.lat) return null;

                        // Check if initiative is related to a supported cause
                        const isRelatedToSupportedCause =
                          highlightSupported && supportedCauses.some((causeId) => initiative.tags?.includes(causeId));

                        return (
                          <motion.div
                            key={initiative._id}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                              selectedInitiative?._id === initiative._id
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50"
                                : isRelatedToSupportedCause
                                ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                            onClick={() => handleSelectInitiative(initiative)}
                            whileHover={{ y: -2 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-white/5">
                                <FaMapMarkerAlt className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">
                                  {initiative.title}
                                  {isRelatedToSupportedCause && (
                                    <span className="ml-2 text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                                      Your Cause
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-white/60 mb-2">{initiative.location}</p>
                                <div className="flex items-center gap-4 text-sm text-white/40">
                                  <div className="flex items-center gap-1">
                                    <FaCalendarAlt className="w-4 h-4" />
                                    <span>{new Date(initiative.nextEvent).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      // No results found
                      <div className="col-span-2 bg-white/5 rounded-lg p-6 text-center">
                        <FaMapMarkerAlt className="mx-auto text-3xl text-white/30 mb-3" />
                        <p className="text-white/60">No initiatives found matching your search.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* People Panel */
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Find People By Cause</h2>
                </div>

                {/* Cause Selector */}
                <div className="mb-6">
                  <label className="block text-sm text-white/60 mb-2">Select a cause to find people:</label>
                  <div className="flex flex-wrap gap-2">
                    {causes.map((cause) => (
                      <motion.button
                        key={cause.id}
                        onClick={() => setSelectedCauseFilter(cause.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
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
                </div>

                {/* People List */}
                <div className="space-y-4 lg:max-h-[calc(100vh-30rem)] lg:overflow-y-auto">
                  {loadingUsers ? (
                    <div className="flex justify-center items-center py-12">
                      <FaSpinner className="animate-spin text-2xl text-blue-400" />
                    </div>
                  ) : selectedCauseFilter && usersWithCause.length === 0 ? (
                    <div className="bg-white/5 rounded-lg p-6 text-center">
                      <FaUsers className="mx-auto text-3xl text-white/30 mb-3" />
                      <p className="text-white/60">
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
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            selectedUser?._id === user._id
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                          onClick={() => handleSelectUser(user)}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-violet-500/20">
                              <FaUser className="w-5 h-5 text-violet-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{user.name}</h3>
                              {user.location && <p className="text-sm text-white/60 mb-2">{user.location}</p>}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {user.supportedCauses?.map((causeId) => {
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
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Map Area */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 min-h-[400px] lg:h-[calc(100vh-16rem)] relative overflow-hidden">
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }} className="z-0">
              <MapController />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Markers */}
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

            {/* Initiative Details Overlay */}
            {selectedInitiative && !selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute bottom-6 right-6 ${
                  isOverlayMinimized ? "w-64" : "w-96"
                } max-w-[calc(100%-3rem)] bg-slate-900/90 backdrop-blur-sm rounded-xl border border-white/10 p-6 z-[1000]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{selectedInitiative.title}</h2>
                    <p className="text-white/60">{selectedInitiative.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsOverlayMinimized(!isOverlayMinimized)}
                      className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
                      title={isOverlayMinimized ? "Expand" : "Minimize"}
                    >
                      {isOverlayMinimized ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedInitiative.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {selectedInitiative.status}
                    </div>
                  </div>
                </div>

                {/* Only show detailed content when not minimized */}
                {!isOverlayMinimized && (
                  <>
                    <p className="text-white/80 text-sm mb-4">{selectedInitiative.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedInitiative.tags
                        ?.filter((tag) => !supportedCauses.includes(tag))
                        .map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10">
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-white/60 mb-4">
                      <div className="flex items-center gap-2">
                        <FaClock />
                        <span>Next event: {new Date(selectedInitiative.nextEvent).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </>
                )}

                <motion.button
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJoinInitiative(selectedInitiative)}
                >
                  Join Initiative
                </motion.button>

                {userData && selectedInitiative?.createdBy?._id === userData._id && (
                  <motion.button
                    className="mt-4 w-full px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg font-medium hover:bg-red-500/30 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Initiative
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* User Profile Overlay */}
            {selectedUser && !selectedInitiative && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 right-6 w-96 max-w-[calc(100%-3rem)] bg-slate-900/90 backdrop-blur-sm rounded-xl border border-white/10 p-6 z-[1000]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center">
                      <FaUser className="text-xl text-violet-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                      {selectedUser.location && <p className="text-white/60">{selectedUser.location}</p>}
                    </div>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-white/40 hover:text-white">
                    ×
                  </button>
                </div>

                {/* Supported Causes */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-white/70 mb-2">Supported Causes:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.supportedCauses?.map((causeId) => {
                      const cause = causes.find((c) => c.id === causeId);
                      if (!cause) return null;

                      return (
                        <span
                          key={causeId}
                          className={`px-3 py-1 rounded-full text-sm bg-${cause.color}-500/20 text-${cause.color}-300 flex items-center gap-1`}
                        >
                          <cause.icon className="w-3 h-3" />
                          {cause.title}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Shared Initiatives */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium text-white/70 mb-2">Common Interests:</h3>
                  <div className="space-y-2">
                    {initiatives
                      .filter((initiative) =>
                        initiative.tags?.some((tag) => selectedUser.supportedCauses?.includes(tag))
                      )
                      .slice(0, 2)
                      .map((initiative) => (
                        <div
                          key={initiative._id}
                          className="p-2 rounded-lg bg-white/5 flex items-center gap-2 cursor-pointer hover:bg-white/10"
                          onClick={() => handleSelectInitiative(initiative)}
                        >
                          <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                          <span className="text-sm truncate">{initiative.title}</span>
                        </div>
                      ))}

                    {initiatives.filter((initiative) =>
                      initiative.tags?.some((tag) => selectedUser.supportedCauses?.includes(tag))
                    ).length === 0 && <p className="text-sm text-white/40">No common initiatives found</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* User location button */}
            {userCoordinates && !showUserLocation && (
              <motion.button
                className="absolute top-4 right-4 z-10 bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={centerOnUserLocation}
                title="Show your location"
              >
                <FaLocationArrow className="text-white" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

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
                  className="text-white/60 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddInitiative} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newInitiative.title}
                    onChange={handleInitiativeFormChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={newInitiative.category}
                    onChange={handleInitiativeFormChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    style={{ colorScheme: "dark" }}
                    required
                  >
                    <option value="" style={{ backgroundColor: "#1e293b", color: "white" }}>
                      Select a category
                    </option>
                    {categories
                      .filter((category) => category !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={newInitiative.description}
                    onChange={handleInitiativeFormChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newInitiative.location}
                    onChange={handleInitiativeFormChange}
                    placeholder="e.g. New York, NY"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tagsInput"
                    value={newInitiative.tagsInput}
                    onChange={handleInitiativeFormChange}
                    placeholder="e.g. climate, education, community"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={newInitiative.website}
                    onChange={handleInitiativeFormChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
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
                      <span className="text-white/80">Active</span>
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
                      <span className="text-white/80">Upcoming</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Next Event Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="nextEvent"
                    value={newInitiative.nextEvent}
                    onChange={handleInitiativeFormChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {formError && (
                  <div className="bg-red-500/30 border border-red-500/50 text-white p-3 rounded-lg">{formError}</div>
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
            <p className="mb-6 text-white/80">
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
