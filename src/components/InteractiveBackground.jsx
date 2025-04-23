import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";

const InteractiveBackground = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Create parallax effect based on scroll
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -100]);
  const particlesY = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0.7]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate particles for network effect
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        initialDelay: Math.random() * 2,
      })),
    []
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base grid background */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"
        style={{ y: backgroundY }}
      />

      {/* Moving gradient waves */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%270 0 800 800%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.01%27 seed=%273%27 numOctaves=%275%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')",
          backgroundSize: "200% 200%",
          y: backgroundY,
          opacity: opacityFade,
        }}
      />

      {/* Particles with network effect */}
      <motion.div className="absolute inset-0" style={{ y: particlesY }}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
              opacity: 0.6,
              zIndex: 1,
            }}
            animate={{
              x: [0, Math.sin(particle.id) * 50, Math.cos(particle.id * 2) * 30, 0],
              y: [0, Math.cos(particle.id) * 50, Math.sin(particle.id * 2) * 30, 0],
              opacity: [0.2, 0.6, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.initialDelay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Mouse-following glow effect */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(50, 55, 199, 0.3) 0%, transparent 70%)",
          x: mousePosition.x * 100 - 400,
          y: mousePosition.y * 100 - 400,
          filter: "blur(10px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary glow effect */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at center, rgba(50, 55, 199, 0.2) 0%, transparent 70%)",
          x: mousePosition.x * 100 - 300,
          y: mousePosition.y * 100 - 300,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Interactive cursor highlight */}
      <motion.div
        className="absolute w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
          x: mousePosition.x * window.innerWidth - 40,
          y: mousePosition.y * window.innerHeight - 40,
          mixBlendMode: "overlay",
        }}
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50" />
    </div>
  );
};

export default InteractiveBackground;
