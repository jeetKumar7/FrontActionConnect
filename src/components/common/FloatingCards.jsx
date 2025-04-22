import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const FloatingCard = ({ title, description, icon, color }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform mouse position into rotation values
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-full perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card container with 3D effect */}
      <motion.div
        className="relative w-full h-full rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glowing border effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(45deg, ${color}40, transparent)`,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon with floating effect */}
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6"
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}40)`,
            }}
            animate={{
              y: isHovered ? [-5, 5, -5] : 0,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>

          {/* Title with gradient text */}
          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
              {title}
            </span>
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {description}
          </p>

          {/* Floating particles */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${color}40, transparent)`,
                    width: Math.random() * 20 + 10,
                    height: Math.random() * 20 + 10,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 50],
                    y: [0, (Math.random() - 0.5) * 50],
                    opacity: [0, 0.5, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FloatingCards = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <FloatingCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCards; 
