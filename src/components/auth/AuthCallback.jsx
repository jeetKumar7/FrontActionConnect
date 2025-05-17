import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaLock, FaUserCheck } from "react-icons/fa";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loadingStep, setLoadingStep] = useState(1);

  // Theme detection
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

  // Loading steps animation
  useEffect(() => {
    if (!error) {
      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(stepInterval);
    }
  }, [error]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get token and user ID from URL params
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");
      const userId = searchParams.get("id");

      if (token && userId) {
        try {
          // Verify the token with our backend
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/success?token=${token}&id=${userId}`
          );
          const data = await response.json();

          if (response.ok) {
            // Store in localStorage (same as regular login)
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);

            // Fetch additional user info
            const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/getuser`, {
              headers: { Authorization: token },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.name) {
                localStorage.setItem("userName", userData.name);
              }
            }

            // Trigger auth state update
            window.dispatchEvent(new Event("storage"));

            // Handle redirection
            const redirectPath = localStorage.getItem("redirectAfterAuth");

            if (redirectPath === "/passion") {
              // This is a new user that came from welcome modal
              localStorage.removeItem("redirectAfterAuth");
              navigate("/passion", { replace: true });
            } else if (redirectPath) {
              localStorage.removeItem("redirectAfterAuth");
              navigate(redirectPath, { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            setError(data.message || "Authentication failed");
            setTimeout(() => navigate("/"), 3000);
          }
        } catch (error) {
          console.error("Auth callback error:", error);
          setError("Failed to complete authentication");
          setTimeout(() => navigate("/"), 3000);
        }
      } else {
        setError("Missing authentication data");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleAuthCallback();
  }, [location, navigate]);

  return (
    <div
      className={`min-h-screen pt-20 flex items-center justify-center ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-b from-blue-50 to-cyan-50 text-slate-800"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full mx-4 p-8 rounded-2xl ${
          isDarkMode
            ? "bg-slate-800/70 border border-white/10 shadow-lg shadow-blue-900/20"
            : "bg-white/90 border border-slate-200 shadow-xl shadow-blue-200/30"
        } backdrop-blur-md`}
      >
        {error ? (
          // Error State
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
            <div className="flex justify-center mb-5">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaExclamationTriangle size={50} className={isDarkMode ? "text-red-400" : "text-red-500"} />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
            <div
              className={`px-5 py-4 rounded-lg mb-4 ${
                isDarkMode
                  ? "bg-red-900/20 border border-red-500/30 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              {error}
            </div>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Redirecting you back...</p>
          </motion.div>
        ) : (
          // Success/Loading State
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Glowing circle background */}
                <div
                  className={`absolute inset-0 rounded-full blur-lg ${
                    isDarkMode ? "bg-blue-600/30" : "bg-blue-400/30"
                  }`}
                ></div>

                {/* Animated ring */}
                <div className="w-24 h-24 relative">
                  <motion.div
                    className={`absolute inset-0 rounded-full border-4 ${
                      isDarkMode ? "border-blue-500" : "border-blue-400"
                    }`}
                    initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                    animate={{
                      rotate: 360,
                      scale: [0.8, 1, 0.8],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <motion.div
                    className={`absolute inset-0 rounded-full border-4 ${
                      isDarkMode ? "border-cyan-500" : "border-cyan-400"
                    } border-dashed`}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <FaLock size={30} className={isDarkMode ? "text-blue-300" : "text-blue-500"} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Completing Sign In
            </h2>

            {/* Progress steps */}
            <div className="space-y-3 max-w-xs mx-auto mb-5">
              <motion.div
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  loadingStep >= 1
                    ? isDarkMode
                      ? "bg-blue-900/20 border border-blue-500/30"
                      : "bg-blue-50 border border-blue-200"
                    : isDarkMode
                    ? "bg-slate-700/50 border border-white/5"
                    : "bg-slate-100 border border-slate-200"
                }`}
                animate={{
                  x: loadingStep >= 1 ? [5, 0] : 0,
                  opacity: loadingStep >= 1 ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    loadingStep >= 1
                      ? isDarkMode
                        ? "bg-blue-500 text-white"
                        : "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-slate-600 text-slate-400"
                      : "bg-slate-300 text-slate-500"
                  }`}
                >
                  {loadingStep > 1 ? <FaCheckCircle size={14} /> : <span className="text-xs font-bold">1</span>}
                </div>
                <span
                  className={`text-sm ${
                    loadingStep >= 1
                      ? isDarkMode
                        ? "text-blue-300"
                        : "text-blue-700"
                      : isDarkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Verifying credentials
                </span>
              </motion.div>

              <motion.div
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  loadingStep >= 2
                    ? isDarkMode
                      ? "bg-blue-900/20 border border-blue-500/30"
                      : "bg-blue-50 border border-blue-200"
                    : isDarkMode
                    ? "bg-slate-700/50 border border-white/5"
                    : "bg-slate-100 border border-slate-200"
                }`}
                animate={{
                  x: loadingStep >= 2 ? [5, 0] : 0,
                  opacity: loadingStep >= 2 ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    loadingStep >= 2
                      ? isDarkMode
                        ? "bg-blue-500 text-white"
                        : "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-slate-600 text-slate-400"
                      : "bg-slate-300 text-slate-500"
                  }`}
                >
                  {loadingStep > 2 ? <FaCheckCircle size={14} /> : <span className="text-xs font-bold">2</span>}
                </div>
                <span
                  className={`text-sm ${
                    loadingStep >= 2
                      ? isDarkMode
                        ? "text-blue-300"
                        : "text-blue-700"
                      : isDarkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Loading profile data
                </span>
              </motion.div>

              <motion.div
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  loadingStep >= 3
                    ? isDarkMode
                      ? "bg-blue-900/20 border border-blue-500/30"
                      : "bg-blue-50 border border-blue-200"
                    : isDarkMode
                    ? "bg-slate-700/50 border border-white/5"
                    : "bg-slate-100 border border-slate-200"
                }`}
                animate={{
                  x: loadingStep >= 3 ? [5, 0] : 0,
                  opacity: loadingStep >= 3 ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    loadingStep >= 3
                      ? isDarkMode
                        ? "bg-blue-500 text-white"
                        : "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-slate-600 text-slate-400"
                      : "bg-slate-300 text-slate-500"
                  }`}
                >
                  {loadingStep > 3 ? <FaCheckCircle size={14} /> : <span className="text-xs font-bold">3</span>}
                </div>
                <span
                  className={`text-sm ${
                    loadingStep >= 3
                      ? isDarkMode
                        ? "text-blue-300"
                        : "text-blue-700"
                      : isDarkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Setting up session
                </span>
              </motion.div>

              <motion.div
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  loadingStep >= 4
                    ? isDarkMode
                      ? "bg-green-900/20 border border-green-500/30"
                      : "bg-green-50 border border-green-200"
                    : isDarkMode
                    ? "bg-slate-700/50 border border-white/5"
                    : "bg-slate-100 border border-slate-200"
                }`}
                animate={{
                  x: loadingStep >= 4 ? [5, 0] : 0,
                  opacity: loadingStep >= 4 ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    loadingStep >= 4
                      ? isDarkMode
                        ? "bg-green-500 text-white"
                        : "bg-green-500 text-white"
                      : isDarkMode
                      ? "bg-slate-600 text-slate-400"
                      : "bg-slate-300 text-slate-500"
                  }`}
                >
                  <FaUserCheck size={14} />
                </div>
                <span
                  className={`text-sm ${
                    loadingStep >= 4
                      ? isDarkMode
                        ? "text-green-300"
                        : "text-green-700"
                      : isDarkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Success! Redirecting...
                </span>
              </motion.div>
            </div>

            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Please wait a moment while we get everything ready
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;
