import { motion } from "framer-motion";
import { FaBook, FaMapMarkedAlt, FaHeart, FaBolt, FaUsers, FaArrowRight } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignUpModal } from "./auth/AuthModals";

const passions = [
  {
    name: "Content Library",
    icon: FaBook,
    color: "blue",
    description:
      "Access a vast collection of resources, articles, and guides to deepen your understanding of various social causes.",
    path: "/library",
  },
  {
    name: "Interactive Map",
    icon: FaMapMarkedAlt,
    color: "purple",
    description:
      "Discover local initiatives, events, and opportunities to make a difference in your community through our interactive mapping system.",
    path: "/map",
  },
  {
    name: "Find Your Passion",
    icon: FaHeart,
    color: "pink",
    description:
      "Explore different causes and find what resonates with you through our personalized passion discovery tools.",
    path: "/passion",
  },
  {
    name: "Action Hub",
    icon: FaBolt,
    color: "yellow",
    description:
      "Connect with ongoing projects and initiatives where you can contribute your skills and make an immediate impact.",
    path: "/hub",
  },
  {
    name: "Community",
    icon: FaUsers,
    color: "green",
    description: "Join a vibrant community of changemakers, share experiences, and collaborate on meaningful projects.",
    path: "/community",
  },
];

const PassionSection = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Check for authentication on component mount and when token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Check immediately on component mount
    checkAuth();

    // Setup event listener for storage changes
    window.addEventListener("storage", checkAuth);

    // Cleanup
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Handle navigation with auth check
  const handleNavigation = (path) => {
    console.log("Navigation triggered to:", path);

    // For these features, we require authentication
    const requiresAuth = ["/passion", "/community", "/map"];

    if (requiresAuth.includes(path) && !isAuthenticated) {
      console.log("Auth required but user not authenticated, showing signup modal");
      // Show signup modal for non-authenticated users
      setShowSignUp(true);
    } else {
      console.log("Navigating to:", path);
      // Navigate to the path directly
      navigate(path);
    }
  };

  // Handle main call-to-action button
  // const handleFindYourPassion = (e) => {
  //   // Stop event propagation
  //   if (e) {
  //     e.stopPropagation();
  //   }

  //   console.log("Find Your Passion button clicked");
  //   if (!isAuthenticated) {
  //     console.log("User not authenticated, showing signup modal");
  //     setShowSignUp(true);
  //   } else {
  //     console.log("Navigating to passion page");
  //     try {
  //       navigate("/passion");
  //     } catch (error) {
  //       console.error("Navigation error:", error);
  //     }
  //   }
  // };

  return (
    <section className="px-6 py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-white mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            ActionConnect
          </span>{" "}
          Works
        </motion.h2>

        <motion.p
          className="text-slate-300 text-center mb-16 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Our platform provides everything you need to discover, learn about, and take action on causes that matter to
          you.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {passions.map((item, idx) => (
            <motion.div
              key={idx}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 cursor-pointer"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                console.log("Tile container clicked:", item.name);
                handleNavigation(item.path);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`text-${item.color}-400 text-4xl mb-6`}>
                <item.icon />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{item.name}</h3>
              <p className="text-slate-300 text-sm">{item.description}</p>
              <motion.button
                onClick={() => {
                  console.log("Tile clicked:", item.name);
                  handleNavigation(item.path);
                }}
                className="mt-6 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}

          {/* Special "Learn More" tile */}
          <motion.div
            className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-blue-500 to-purple-500 border border-white/20 cursor-pointer"
            whileHover={{ y: -5, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate("/learn-more")}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-2xl font-bold text-white mb-4">Want to Learn More?</h3>
            <p className="text-white/90 text-sm mb-8">
              Discover the full potential of ActionConnect and how our platform can help you make a meaningful impact on
              causes that matter to you.
            </p>
            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // Prevent double triggering
                navigate("/learn-more");
              }}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-500 bg-white rounded-lg hover:bg-white/90 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More <FaArrowRight className="ml-1" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Add SignUp Modal */}
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
};

export default PassionSection;
