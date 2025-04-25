import { motion } from "framer-motion";
import { FaBook, FaMapMarkedAlt, FaHeart, FaBolt, FaUsers, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignUpModal } from "./auth/AuthModals";

// Updated passions array with consistent color scheme
const passions = [
  {
    name: "Content Library",
    icon: FaBook,
    color: "text-cyan-400", // Simplified to just text color
    description:
      "Access a vast collection of resources, articles, and guides to deepen your understanding of various social causes.",
    path: "/library",
  },
  {
    name: "Interactive Map",
    icon: FaMapMarkedAlt,
    color: "text-teal-400",
    description:
      "Discover local initiatives, events, and opportunities to make a difference in your community through our interactive mapping system.",
    path: "/map",
  },
  {
    name: "Find Your Passion",
    icon: FaHeart,
    color: "text-cyan-400",
    description:
      "Explore different causes and find what resonates with you through our personalized passion discovery tools.",
    path: "/passion",
  },
  {
    name: "Action Hub",
    icon: FaBolt,
    color: "text-teal-400",
    description:
      "Connect with ongoing projects and initiatives where you can contribute your skills and make an immediate impact.",
    path: "/hub",
  },
  {
    name: "Community",
    icon: FaUsers,
    color: "text-cyan-400",
    description: "Join a vibrant community of changemakers, share experiences, and collaborate on meaningful projects.",
    path: "/community",
  },
];

const PassionSection = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
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
    <section className="relative min-h-screen bg-slate-900 py-16">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full bg-cyan-600/10 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full bg-teal-600/10 blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Passion</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Explore our platform to find causes that resonate with you and take meaningful action to make a difference.
          </p>
        </motion.div>

        {/* Passion Tiles - Updated with fresh, clean design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {passions.map((item, idx) => (
            <motion.div
              key={idx}
              className="relative group bg-slate-800/70 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-lg cursor-pointer"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.9)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="relative z-10">
                <div className={`${item.color} text-4xl mb-4`}>
                  <item.icon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-slate-300 text-sm">{item.description}</p>
                <div className="mt-6 flex items-center">
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/5"
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
