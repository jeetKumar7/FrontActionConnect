import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const FuturisticBackground = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.2]);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate floating elements with different shapes
  const elements = Array.from({ length: 8 }).map((_, i) => {
    const size = 50 + Math.random() * 100;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const rotation = Math.random() * 360;
    const duration = 20 + Math.random() * 10;
    const delay = Math.random() * duration;
    
    return {
      id: i,
      size,
      startX,
      startY,
      rotation,
      duration,
      delay,
      shape: i % 3 === 0 ? "circle" : i % 3 === 1 ? "triangle" : "square",
    };
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Main background with gradient mesh */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(59, 130, 246, 0.1) 0%, 
              transparent 50%),
            linear-gradient(45deg, 
              rgba(59, 130, 246, 0.05) 0%, 
              rgba(147, 51, 234, 0.05) 50%, 
              rgba(236, 72, 153, 0.05) 100%)
          `,
          transform: `scale(${scale})`,
        }}
      >
        {/* Grid overlay with perspective */}
        <div className="absolute inset-0 perspective-1000">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] transform-gpu" />
        </div>
      </motion.div>

      {/* Floating 3D-like elements */}
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${
            element.shape === "circle"
              ? "rounded-full"
              : element.shape === "triangle"
              ? "clip-triangle"
              : "rounded-lg"
          }`}
          style={{
            width: element.size,
            height: element.size,
            left: `${element.startX}%`,
            top: `${element.startY}%`,
            background: `linear-gradient(45deg, 
              rgba(59, 130, 246, 0.1) 0%, 
              rgba(147, 51, 234, 0.1) 50%, 
              rgba(236, 72, 153, 0.1) 100%)`,
            transform: `rotate(${element.rotation}deg)`,
            backdropFilter: "blur(10px)",
          }}
          animate={{
            x: [
              `${element.startX}%`,
              `${(element.startX + 30) % 100}%`,
              `${(element.startX - 15) % 100}%`,
              `${element.startX}%`,
            ],
            y: [
              `${element.startY}%`,
              `${(element.startY + 20) % 100}%`,
              `${(element.startY - 10) % 100}%`,
              `${element.startY}%`,
            ],
            rotate: [element.rotation, element.rotation + 180, element.rotation + 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
            times: [0, 0.5, 0.8, 1],
          }}
        />
      ))}

      {/* Animated light beams */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            45deg,
            transparent 0%,
            rgba(59, 130, 246, 0.1) 25%,
            rgba(147, 51, 234, 0.1) 50%,
            rgba(236, 72, 153, 0.1) 75%,
            transparent 100%
          )`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Mouse-following highlight with 3D effect */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
          x: mousePosition.x * 100 - 200,
          y: mousePosition.y * 100 - 200,
          transform: `translate3d(${mousePosition.x * 40 - 20}px, ${
            mousePosition.y * 40 - 20
          }px, 0)`,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
    </div>
  );
};

export default FuturisticBackground; 
