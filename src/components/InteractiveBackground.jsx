import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const InteractiveBackground = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect for background elements
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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

  // Generate floating particles with smoother movement patterns
  const particles = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const duration = 15 + Math.random() * 10; // Longer duration for smoother movement
    const delay = Math.random() * duration;
    
    return {
      id: i,
      size,
      startX,
      startY,
      duration,
      delay,
    };
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Animated grid background */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x * 100}% ${
            mousePosition.y * 100
          }%, rgba(255,255,255,0.1) 0%, transparent 20%)`,
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      </motion.div>

      {/* Floating particles with smoother animations */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.startX}%`,
            top: `${particle.startY}%`,
          }}
          animate={{
            x: [
              `${particle.startX}%`,
              `${(particle.startX + 20) % 100}%`,
              `${(particle.startX - 10) % 100}%`,
              `${particle.startX}%`,
            ],
            y: [
              `${particle.startY}%`,
              `${(particle.startY + 15) % 100}%`,
              `${(particle.startY - 5) % 100}%`,
              `${particle.startY}%`,
            ],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
            times: [0, 0.5, 0.8, 1],
          }}
        />
      ))}

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(147,51,234,0.5) 100%)",
          left: "20%",
          top: "20%",
          y,
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.5) 0%, rgba(236,72,153,0.5) 100%)",
          right: "20%",
          bottom: "20%",
          y: useTransform(scrollY, [0, 500], [0, -100]),
        }}
      />

      {/* Mouse-following highlight */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
          x: mousePosition.x * 100 - 50,
          y: mousePosition.y * 100 - 50,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
    </div>
  );
};

export default InteractiveBackground; 
