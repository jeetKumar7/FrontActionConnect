import { motion } from "framer-motion";
import { FaBook, FaMapMarkedAlt, FaHeart, FaBolt, FaUsers, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignUpModal } from "./auth/AuthModals";

const passions = [
  {
    name: "Content Library",
    icon: FaBook,
    color: "from-blue-500 to-indigo-500",
    description:
      "Access a vast collection of resources, articles, and guides to deepen your understanding of various social causes.",
    path: "/library",
  },
  {
    name: "Interactive Map",
    icon: FaMapMarkedAlt,
    color: "from-purple-500 to-pink-500",
    description:
      "Discover local initiatives, events, and opportunities to make a difference in your community through our interactive mapping system.",
    path: "/map",
  },
  {
    name: "Find Your Passion",
    icon: FaHeart,
    color: "from-pink-500 to-red-500",
    description:
      "Explore different causes and find what resonates with you through our personalized passion discovery tools.",
    path: "/passion",
  },
  {
    name: "Action Hub",
    icon: FaBolt,
    color: "from-yellow-500 to-orange-500",
    description:
      "Connect with ongoing projects and initiatives where you can contribute your skills and make an immediate impact.",
    path: "/hub",
  },
  {
    name: "Community",
    icon: FaUsers,
    color: "from-green-500 to-teal-500",
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
    <section className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 py-16">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full bg-purple-900/20 blur-[120px]"></div>
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
            Discover Your <span className="text-indigo-400">Passion</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Explore our platform to find causes that resonate with you and take meaningful action to make a difference.
          </p>
        </motion.div>

        {/* Passion Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {passions.map((item, idx) => (
            <motion.div
              key={idx}
              className="relative group bg-gradient-to-br p-6 rounded-2xl shadow-lg cursor-pointer"
              style={{ backgroundImage: `linear-gradient(to bottom right, ${item.color})` }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-white text-4xl mb-4">
                  <item.icon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-slate-200 text-sm">{item.description}</p>
                <motion.button
                  className="mt-6 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
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
