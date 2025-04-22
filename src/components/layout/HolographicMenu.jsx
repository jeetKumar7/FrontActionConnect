import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const HolographicMenu = ({ isOpen, onClose }) => {
  const menuRef = useRef(null);
  const [activeLink, setActiveLink] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/content-library", label: "Content Library" },
    { path: "/community", label: "Community" },
    { path: "/action-hub", label: "Action Hub" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Holographic menu container */}
          <motion.div
            ref={menuRef}
            className="fixed top-0 right-0 h-full w-64 sm:w-80 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl z-50 border-l border-white/10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Holographic effect overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Menu content */}
            <div className="relative z-10 h-full flex flex-col p-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="self-end p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Menu items */}
              <nav className="mt-8 space-y-4">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.path}
                    onHoverStart={() => setActiveLink(item.path)}
                    onHoverEnd={() => setActiveLink(null)}
                  >
                    <Link
                      to={item.path}
                      className="block relative py-3 px-4 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      {/* Hover effect line */}
                      <motion.div
                        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                        style={{
                          background: "linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5))",
                        }}
                        animate={{
                          opacity: activeLink === item.path ? 1 : 0,
                          scale: activeLink === item.path ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      />

                      {/* Text with gradient effect */}
                      <motion.span
                        className="relative z-10"
                        animate={{
                          textShadow: activeLink === item.path
                            ? [
                                "0 0 5px rgba(59,130,246,0.5)",
                                "0 0 10px rgba(147,51,234,0.5)",
                                "0 0 5px rgba(59,130,246,0.5)",
                              ]
                            : "none",
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom section with user info */}
              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div>
                    <p className="text-white font-medium">User Name</p>
                    <p className="text-sm text-slate-400">View Profile</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HolographicMenu; 
