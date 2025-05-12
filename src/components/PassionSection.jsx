import { motion } from "framer-motion";
import { FaBook, FaMapMarkedAlt, FaHeart, FaBolt, FaUsers, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignUpModal } from "./auth/AuthModals";

// Updated passions array with theme-aware color scheme
const passions = [
  {
    name: "Content Library",
    icon: FaBook,
    darkColor: "text-cyan-400",
    lightColor: "text-blue-600",
    description:
      "Access a vast collection of resources, articles, and guides to deepen your understanding of various social causes.",
    path: "/library",
  },
  {
    name: "Interactive Map",
    icon: FaMapMarkedAlt,
    darkColor: "text-teal-400",
    lightColor: "text-teal-600",
    description:
      "Discover local initiatives, events, and opportunities to make a difference in your community through our interactive mapping system.",
    path: "/map",
  },
  {
    name: "Find Your Passion",
    icon: FaHeart,
    darkColor: "text-cyan-400",
    lightColor: "text-rose-500",
    description:
      "Explore different causes and find what resonates with you through our personalized passion discovery tools.",
    path: "/passion",
  },
  {
    name: "Action Hub",
    icon: FaBolt,
    darkColor: "text-teal-400",
    lightColor: "text-amber-500",
    description:
      "Connect with ongoing projects and initiatives where you can contribute your skills and make an immediate impact.",
    path: "/hub",
  },
  {
    name: "Community",
    icon: FaUsers,
    darkColor: "text-cyan-400",
    lightColor: "text-indigo-500",
    description: "Join a vibrant community of changemakers, share experiences, and collaborate on meaningful projects.",
    path: "/community",
  },
];

const PassionSection = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Check for authentication and theme on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Check if light mode is active
    const isLightMode = document.body.classList.contains("light");
    setIsDarkMode(!isLightMode);

    // Listen for theme changes
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

  const handleNavigation = (path) => {
    const requiresAuth = ["/passion", "/community", "/map"];
    if (requiresAuth.includes(path) && !isAuthenticated) {
      setShowSignUp(true);
    } else {
      navigate(path);
    }
  };

  return (
    <section className="relative min-h-screen bg-[var(--bg-secondary)] py-16">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Discover Your{" "}
            <span
              className={`bg-gradient-to-r ${
                isDarkMode ? "from-cyan-400 to-teal-400" : "from-blue-500 to-cyan-500"
              } bg-clip-text text-transparent`}
            >
              Passion
            </span>
          </h2>
          <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-lg max-w-2xl mx-auto`}>
            Explore our platform to find causes that resonate with you and take meaningful action to make a difference.
          </p>
        </motion.div>

        {/* Passion Tiles - Theme aware design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {passions.map((item, idx) => (
            <motion.div
              key={idx}
              className={`relative group p-6 rounded-2xl shadow-lg cursor-pointer ${
                isDarkMode
                  ? "bg-slate-800/70 backdrop-blur-sm border border-white/10"
                  : "bg-white border border-slate-200"
              }`}
              whileHover={{
                scale: 1.02,
                backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 1)",
                boxShadow: isDarkMode ? "" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="relative z-10">
                <div className={`text-4xl mb-4 ${isDarkMode ? item.darkColor : item.lightColor}`}>
                  <item.icon />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{item.name}</h3>
                <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-sm`}>{item.description}</p>
                <div className="mt-6 flex items-center">
                  <motion.button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      isDarkMode
                        ? "text-[var(--text-primary)] bg-white/10 hover:bg-white/20 border border-white/5"
                        : "text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Explore</span>
                    <FaArrowRight className="text-xs" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sign Up Modal */}
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </section>
  );
};

export default PassionSection;
