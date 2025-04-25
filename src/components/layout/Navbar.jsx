import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaBook,
  FaMapMarkedAlt,
  FaHeart,
  FaBolt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { SignInModal, SignUpModal } from "../auth/AuthModals";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenSignIn = () => {
    setShowSignUp(false);
    setTimeout(() => {
      setShowSignIn(true);
    }, 300); // Delay to allow the sign-up modal to close before opening sign-in
  };

  const handleOpenSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  // Update this function to ensure navigation works properly
  const handleProtectedNavigation = (e, path) => {
    e.preventDefault(); // Prevent any default behavior
    console.log("Navigation requested to:", path);

    // Define routes requiring authentication
    const requiresAuth = ["/passion", "/community", "/map"];

    if (requiresAuth.includes(path) && !isAuthenticated) {
      console.log("Auth required for:", path);
      // Close mobile menu if open
      setIsOpen(false);
      // Show signup modal for non-authenticated users
      setShowSignUp(true);
    } else {
      console.log("Navigating to:", path);
      // Close mobile menu if open
      setIsOpen(false);

      // Use direct window location as a fallback if navigate doesn't work
      setTimeout(() => {
        try {
          navigate(path);
          console.log("Navigation completed");
        } catch (error) {
          console.error("Navigation failed, using fallback:", error);
          window.location.href = path;
        }
      }, 0);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check for authentication on component mount and when token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Check immediately on component mount
    checkAuth();

    // Setup event listener for storage changes (if user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    // Cleanup
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear all auth related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // Update auth state
    setIsAuthenticated(false);
    setShowProfileMenu(false);

    // Navigate to home page
    navigate("/", { replace: true });

    // Force a page refresh to ensure all components recognize the auth change
    window.location.reload();
  };

  const navLinks = [
    {
      name: "Content Library",
      path: "/library",
      icon: <FaBook className="text-blue-400" />,
    },
    {
      name: "Interactive Map",
      path: "/map",
      icon: <FaMapMarkedAlt className="text-purple-400" />,
    },
    {
      name: "Find Your Passion",
      path: "/passion",
      icon: <FaHeart className="text-pink-400" />,
    },
    {
      name: "Action Hub",
      path: "/hub",
      icon: <FaBolt className="text-yellow-400" />,
    },
    {
      name: "Community",
      path: "/community",
      icon: <FaUsers className="text-green-400" />,
    },
  ];

  return (
    <motion.nav className="fixed w-full top-0 z-50 transition-all duration-500 py-2.5 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-md shadow-black/10">
      {/* Container remains the same */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo simplified */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-lg bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-900/20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]"></div>
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.38197 13.0007C3.38197 12.4715 3.80969 12.0437 4.33891 12.0437H8.86768C9.3969 12.0437 9.82462 12.4715 9.82462 13.0007V19.1443C9.82462 19.6735 9.3969 20.1013 8.86768 20.1013H4.33891C3.80969 20.1013 3.38197 19.6735 3.38197 19.1443V13.0007Z"
                    fill="white"
                  />
                  <path
                    d="M12.2877 4.85699C12.2877 4.32778 12.7154 3.90005 13.2446 3.90005H17.7734C18.3026 3.90005 18.7303 4.32778 18.7303 4.85699V19.1443C18.7303 19.6735 18.3026 20.1013 17.7734 20.1013H13.2446C12.7154 20.1013 12.2877 19.6735 12.2877 19.1443V4.85699Z"
                    fill="white"
                  />
                  <path
                    d="M9.08462 6.72516C9.70484 4.97328 10.958 3.54251 12.5749 2.67943C12.8949 2.48878 13.2879 2.6725 13.324 3.03946L13.3321 3.12304C13.3683 3.48999 13.1223 3.82539 12.7624 3.90753C11.5319 4.20269 10.4879 5.0299 9.8587 6.19127C9.70163 6.52148 9.37105 6.75531 8.99757 6.65271C8.62409 6.55011 8.46637 6.16341 8.62343 5.8332C8.74204 5.56994 8.89731 5.32403 9.08462 5.09946"
                    fill="white"
                  />
                  <path
                    d="M3.91247 7.2901C4.29599 7.27276 4.59799 7.58027 4.59799 7.96446V7.96446C4.59799 8.34865 4.29599 8.65616 3.91247 8.63882C3.86459 8.63656 3.81709 8.63328 3.77001 8.62898C3.40347 8.59994 3.12307 8.28932 3.15211 7.92278V7.92278C3.18114 7.55623 3.49176 7.27583 3.85831 7.30487C3.87627 7.30675 3.89427 7.30881 3.91231 7.31107"
                    fill="white"
                  />
                  <path
                    d="M7.2901 3.91247C7.27276 4.29599 7.58027 4.59799 7.96446 4.59799H7.96446C8.34865 4.59799 8.65616 4.29599 8.63882 3.91247C8.63656 3.86459 8.63328 3.81709 8.62898 3.77001C8.59994 3.40347 8.28932 3.12307 7.92278 3.15211V3.15211C7.55623 3.18114 7.27583 3.49176 7.30487 3.85831C7.30675 3.87627 7.30881 3.89427 7.31107 3.91231"
                    fill="white"
                  />
                  <path
                    d="M20.8767 7.2901C20.4932 7.27276 20.1912 7.58027 20.1912 7.96446V7.96446C20.1912 8.34865 20.4932 8.65616 20.8767 8.63882C20.9246 8.63656 20.9721 8.63328 21.0192 8.62898C21.3857 8.59994 21.6661 8.28932 21.6371 7.92278V7.92278C21.6081 7.55623 21.2974 7.27583 20.9309 7.30487C20.9129 7.30675 20.8949 7.30881 20.8769 7.31107"
                    fill="white"
                  />
                  <path
                    d="M9.84555 20.9371C9.80581 20.5751 10.1011 20.2548 10.4643 20.2548H10.4643C10.8276 20.2548 11.1228 20.5751 11.0831 20.9371C11.0787 20.9842 11.0732 21.0311 11.0666 21.0777C11.0304 21.441 10.7136 21.7139 10.3503 21.6777H10.3503C9.98699 21.6415 9.71405 21.3247 9.75027 20.9614C9.75667 20.9202 9.76198 20.8789 9.76618 20.8373"
                    fill="white"
                  />
                  <path
                    d="M13.9287 20.9371C13.9684 20.5751 13.6732 20.2548 13.3099 20.2548H13.3099C12.9467 20.2548 12.6514 20.5751 12.6912 20.9371C12.6956 20.9842 12.701 21.0311 12.7076 21.0777C12.7438 21.441 13.0606 21.7139 13.424 21.6777H13.424C13.7873 21.6415 14.0602 21.3247 14.024 20.9614C14.0176 20.9202 14.0123 20.8789 14.0081 20.8373"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight">ActionConnect</span>
                <span className="text-[10px] text-cyan-400/80 font-medium uppercase tracking-wider -mt-1">
                  Impact Platform
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Navigation links simplified */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center">
              {navLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ x: 5 }} className="w-full">
                  <Link
                    to={link.path}
                    onClick={(e) => {
                      const requiresAuth = ["/passion", "/community", "/map"];
                      if (requiresAuth.includes(link.path) && !isAuthenticated) {
                        e.preventDefault();
                        handleProtectedNavigation(e, link.path);
                      }
                    }}
                    className="flex items-center text-left w-full text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors uppercase whitespace-nowrap tracking-wide"
                  >
                    <span>{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Auth buttons simplified */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleOpenSignIn}
                  className="text-slate-300 hover:text-white text-sm font-medium px-3 py-1.5 hover:bg-white/5 rounded-md transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Sign in
                </motion.button>
                <motion.button
                  onClick={handleOpenSignUp}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Get Started
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Notification */}
                <motion.button
                  className="h-8 w-8 rounded-md bg-slate-800 border border-white/10 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaBell size={16} className="text-slate-400" />
                </motion.button>

                {/* Profile */}
                <div className="relative" ref={profileMenuRef}>
                  <motion.button
                    className="h-8 w-8 rounded-md bg-slate-800 border border-white/10 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <FaUserCircle size={16} className="text-slate-400" />
                  </motion.button>

                  {/* Dropdown Menu simplified */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-52 bg-slate-800 border border-white/10 rounded-md py-1.5 shadow-2xl z-50"
                      >
                        <div className="px-3 py-2 border-b border-white/10">
                          <div className="font-medium text-white">{localStorage.getItem("userName") || "User"}</div>
                          <div className="text-xs text-slate-400 truncate">
                            {localStorage.getItem("userEmail") || "user@example.com"}
                          </div>
                        </div>

                        {/* Profile Links */}
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <FaUserCircle className="text-cyan-400 text-xs" /> Your Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <FaCog className="text-cyan-400 text-xs" /> Settings
                          </Link>
                        </div>

                        <div className="border-t border-white/10 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
                          >
                            <FaSignOutAlt className="text-red-400 text-xs" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button simplified */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile menu simplified */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-2 pb-3 border-t border-white/10 pt-2"
            >
              <div className="flex flex-col space-y-1 px-2">
                {navLinks.map((link) => (
                  <motion.div key={link.name} whileHover={{ x: 5 }} className="w-full">
                    <Link
                      to={link.path}
                      onClick={(e) => {
                        const requiresAuth = ["/passion", "/community", "/map"];
                        if (requiresAuth.includes(link.path) && !isAuthenticated) {
                          e.preventDefault();
                          handleProtectedNavigation(e, link.path);
                        }
                      }}
                      className="flex items-center text-left w-full text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors uppercase whitespace-nowrap tracking-wide"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile divider */}
                <div className="border-t border-white/10 my-2 pt-2">
                  {!isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleOpenSignIn}
                        className="w-full bg-slate-800 text-white py-2.5 px-3 rounded-md font-medium text-center text-sm border border-white/10"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleOpenSignUp}
                        className="w-full bg-cyan-600 text-white py-2.5 px-3 rounded-md font-medium text-center text-sm"
                      >
                        Get Started
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors"
                      >
                        <FaUserCircle className="text-cyan-400" /> Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 py-2.5 px-3 rounded-md font-medium text-sm"
                      >
                        <FaSignOutAlt /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Modals remain unchanged */}
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} onSwitchToSignUp={handleOpenSignUp} />
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} onSwitchToSignIn={handleOpenSignIn} />
    </motion.nav>
  );
};

export default Navbar;
