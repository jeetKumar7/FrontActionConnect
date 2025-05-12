import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSpinner,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaLeaf,
  FaCheck,
  FaPlus,
  FaMapMarkerAlt,
  FaKey,
} from "react-icons/fa";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getSupportedCauses,
  removeSupportedCause,
  changePassword,
} from "../../services";
import { useNavigate } from "react-router-dom";
import { causes, getCauseById } from "../../data/causes";

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

const UserProfile = () => {
  const isDarkMode = useThemeDetection();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportedCauses, setSupportedCauses] = useState([]);
  const [causeActionLoading, setCauseActionLoading] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ message: "", type: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await getUserProfile();
        if (response.error) {
          setError(response.error);
        } else {
          setUserData(response);
          setEditFormData({
            name: response.name || "",
            email: response.email || "",
            location: response.location || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile. Please try again.", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSupportedCauses = async () => {
      try {
        const causes = await getSupportedCauses();
        if (!causes.error) {
          setSupportedCauses(causes);
        }
      } catch (error) {
        console.error("Failed to fetch supported causes:", error);
      }
    };

    fetchUserProfile();
    fetchSupportedCauses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await updateUserProfile(editFormData);
      if (response.error) {
        setError(response.error);
      } else {
        setUserData(response);
        setIsEditing(false);
        setActionFeedback({
          message: "Profile updated successfully",
          type: "success",
        });
        setTimeout(() => {
          setActionFeedback({ message: "", type: "" });
        }, 3000);
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    try {
      const response = await deleteUserAccount();
      if (response.error) {
        setError(response.error);
      } else {
        // Clear localStorage and redirect to login
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (err) {
      setError("Failed to delete account. Please try again.", err);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRemoveCause = async (causeId, causeTitle) => {
    setCauseActionLoading((prev) => ({ ...prev, [causeId]: true }));
    try {
      const response = await removeSupportedCause(causeId.toString());
      if (!response.error) {
        setSupportedCauses(response.supportedCauses || []);
        setActionFeedback({
          message: `Removed ${causeTitle} from your supported causes`,
          type: "info",
        });
      } else {
        setActionFeedback({
          message: response.error,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error removing cause:", error);
      setActionFeedback({
        message: "There was an error. Please try again.",
        type: "error",
      });
    } finally {
      setCauseActionLoading((prev) => ({ ...prev, [causeId]: false }));
      // Clear feedback after 3 seconds
      setTimeout(() => {
        setActionFeedback({ message: "", type: "" });
      }, 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Reset states
    setPasswordError("");
    setPasswordSuccess("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

      if (result.success) {
        setPasswordSuccess(result.message);
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Close form after 2 seconds
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(result.error);
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred", err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className={`${
            isDarkMode ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-red-100 border-red-300 text-red-600"
          } p-4 rounded-lg border`}
        >
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-2 px-4 py-2 ${isDarkMode ? "bg-red-500" : "bg-red-600"} text-white rounded-lg`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gradient-to-b from-slate-900 to-slate-800" : "bg-gradient-to-b from-white to-slate-100"
      } text-[var(--text-primary)] pt-20 pb-12`}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-[var(--text-primary)]/60">Manage your account and preferences</p>
        </div>

        {/* Action Feedback Message */}
        <AnimatePresence>
          {actionFeedback.message && (
            <motion.div
              className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg ${
                actionFeedback.type === "success"
                  ? "bg-green-500/80"
                  : actionFeedback.type === "error"
                  ? "bg-red-500/80"
                  : "bg-blue-500/80"
              } backdrop-blur-sm text-white`}
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {actionFeedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div
          className={`${
            isDarkMode
              ? "bg-white/5 backdrop-blur-sm border border-white/10"
              : "bg-white backdrop-blur-sm border border-slate-200"
          } rounded-xl p-8`}
        >
          {/* Profile Actions */}
          <div className="flex justify-end mb-6 gap-4">
            {!isEditing ? (
              <>
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEdit />
                  Edit Profile
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`px-4 py-2 ${
                    isDarkMode
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
                      : "bg-red-100 text-red-600 hover:bg-red-200 border border-red-300"
                  } rounded-lg flex items-center gap-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTrash />
                  Delete Account
                </motion.button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className={`px-4 py-2 ${
                  isDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                } rounded-lg flex items-center gap-2`}
              >
                <FaTimes />
                Cancel
              </button>
            )}
          </div>

          {/* Profile Content */}
          {!isEditing ? (
            <div className="space-y-8">
              {/* User Information */}
              <div>
                <h3
                  className={`text-xl font-semibold mb-4 pb-2 border-b ${
                    isDarkMode ? "border-white/10" : "border-slate-200"
                  }`}
                >
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[var(--text-primary)]/60 text-sm mb-1">Name</p>
                    <p className="text-lg">{userData?.name}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)]/60 text-sm mb-1">Email</p>
                    <p className="text-lg">{userData?.email}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)]/60 text-sm mb-1">Location</p>
                    <p className="text-lg flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[var(--text-primary)]/40" />
                      {userData?.location || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)]/60 text-sm mb-1">Member Since</p>
                    <p className="text-lg flex items-center gap-2">
                      <FaCalendarAlt className="text-[var(--text-primary)]/40" />
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Causes */}
              <div className="mt-8">
                <h3
                  className={`text-xl font-semibold mb-4 pb-2 border-b ${
                    isDarkMode ? "border-white/10" : "border-slate-200"
                  }`}
                >
                  Causes You Support
                </h3>
                {supportedCauses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {supportedCauses.map((causeId) => {
                      const cause = getCauseById(causeId);
                      if (!cause) return null;

                      return (
                        <div
                          key={causeId}
                          className={`flex items-center gap-2 p-3 ${
                            isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                          } rounded-lg border`}
                        >
                          <div className={`p-2 rounded-lg bg-${cause.color}-500/20`}>
                            <cause.icon className={`w-4 h-4 text-${cause.color}-400`} />
                          </div>
                          <span>{cause.title}</span>
                          <button
                            onClick={() => handleRemoveCause(cause.id, cause.title)}
                            className={`ml-auto ${
                              isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"
                            }`}
                            disabled={causeActionLoading[cause.id]}
                          >
                            {causeActionLoading[cause.id] ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[var(--text-primary)]/60">
                    You haven't supported any causes yet. Take the{" "}
                    <a href="/passion" className="text-blue-400 hover:underline">
                      Find Your Passion
                    </a>{" "}
                    quiz to discover causes that align with your values.
                  </p>
                )}
              </div>

              {/* Account Security (mock section) */}
              <div>
                <h3
                  className={`text-xl font-semibold mb-4 pb-2 border-b ${
                    isDarkMode ? "border-white/10" : "border-slate-200"
                  }`}
                >
                  Account Security
                </h3>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? "bg-white/5" : "bg-blue-50"}`}>
                    <FaShieldAlt className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Password</h4>
                    <p className="text-sm text-[var(--text-primary)]/60 mb-2">
                      Keep your account secure with a strong password
                    </p>

                    {!showPasswordForm ? (
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className={`px-3 py-1 ${
                          isDarkMode
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        } rounded text-sm flex items-center gap-1`}
                      >
                        <FaKey className="text-yellow-400" /> Change Password
                      </button>
                    ) : (
                      <div
                        className={`${
                          isDarkMode ? "bg-slate-800/70 border-white/10" : "bg-slate-50 border-slate-200"
                        } p-4 rounded-lg mt-2 border`}
                      >
                        {passwordError && (
                          <div
                            className={`mb-4 p-3 ${
                              isDarkMode
                                ? "bg-red-500/20 border-red-500/40 text-red-400"
                                : "bg-red-100 border-red-200 text-red-500"
                            } border rounded-lg text-sm`}
                          >
                            {passwordError}
                          </div>
                        )}

                        {passwordSuccess && (
                          <div
                            className={`mb-4 p-3 ${
                              isDarkMode
                                ? "bg-green-500/20 border-green-500/40 text-green-400"
                                : "bg-green-100 border-green-200 text-green-600"
                            } border rounded-lg text-sm flex items-center gap-2`}
                          >
                            <FaCheck /> {passwordSuccess}
                          </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-3">
                          <div>
                            <label className="block text-sm text-[var(--text-primary)]/60 mb-1">Current Password</label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordInputChange}
                              className={`w-full px-3 py-2 ${
                                isDarkMode ? "bg-[var(--bg-secondary)]/50 border-white/10" : "bg-white border-slate-300"
                              } border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500`}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-[var(--text-primary)]/60 mb-1">New Password</label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordInputChange}
                              className={`w-full px-3 py-2 ${
                                isDarkMode ? "bg-[var(--bg-secondary)]/50 border-white/10" : "bg-white border-slate-300"
                              } border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500`}
                              required
                              minLength={6}
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-[var(--text-primary)]/60 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              className={`w-full px-3 py-2 ${
                                isDarkMode ? "bg-[var(--bg-secondary)]/50 border-white/10" : "bg-white border-slate-300"
                              } border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500`}
                              required
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordForm(false);
                                setPasswordError("");
                                setPasswordSuccess("");
                                setPasswordData({
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                });
                              }}
                              className={`px-3 py-1 ${
                                isDarkMode ? "bg-slate-700" : "bg-slate-200 text-slate-700"
                              } rounded text-sm`}
                            >
                              Cancel
                            </button>

                            <button
                              type="submit"
                              disabled={passwordLoading}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm flex items-center gap-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {passwordLoading ? (
                                <>
                                  <FaSpinner className="animate-spin" /> Updating...
                                </>
                              ) : (
                                <>Update Password</>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)]/60 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 placeholder-white/40"
                        : "bg-white border-slate-300 placeholder-slate-400"
                    } border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)]/60 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 placeholder-white/40"
                        : "bg-white border-slate-300 placeholder-slate-400"
                    } border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-[var(--text-primary)]/60 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editFormData.location}
                    onChange={handleInputChange}
                    placeholder="City, State, Country"
                    className={`w-full px-4 py-3 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 placeholder-white/40"
                        : "bg-white border-slate-300 placeholder-slate-400"
                    } border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${
                isDarkMode ? "bg-slate-800 border-red-500/30" : "bg-white border-red-200"
              } rounded-xl p-6 w-full max-w-md border`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                Delete Your Account?
              </h3>
              <p className="mb-6 text-[var(--text-primary)]/80">
                This action is irreversible. All your data, including posts, comments, and profile information will be
                permanently deleted.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`px-4 py-2 ${
                    isDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  } rounded-lg`}
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
