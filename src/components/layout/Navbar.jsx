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
import HolographicMenu from "./HolographicMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleProtectedNavigation = (e, path) => {
    e.preventDefault(); // Prevent default navigation

    // Define routes requiring authentication
    const requiresAuth = ["/passion", "/community", "/map"];

    if (requiresAuth.includes(path) && !isAuthenticated) {
      console.log("Auth required for:", path);
      // Close mobile menu if open
      setIsMenuOpen(false);
      // Show signup modal for non-authenticated users
      setShowSignUp(true);
    } else {
      // Navigate to the path directly
      setIsMenuOpen(false);
      navigate(path);
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-white font-bold text-xl">ActionConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/content-library" className="text-white hover:text-blue-400 transition-colors">
              Content Library
            </Link>
            <Link to="/community" className="text-white hover:text-blue-400 transition-colors">
              Community
            </Link>
            <Link to="/action-hub" className="text-white hover:text-blue-400 transition-colors">
              Action Hub
            </Link>
            <Link to="/profile" className="text-white hover:text-blue-400 transition-colors">
              Profile
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Holographic Menu */}
      <HolographicMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Auth Modals */}
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} onSwitchToSignUp={handleOpenSignUp} />
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} onSwitchToSignIn={handleOpenSignIn} />
    </nav>
  );
};

export default Navbar;
