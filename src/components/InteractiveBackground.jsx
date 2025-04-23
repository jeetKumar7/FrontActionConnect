import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";

const InteractiveBackground = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const { scrollY } = useScroll();

  // Enhanced parallax effects
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -100]);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);
  const gridOpacity = useTransform(scrollY, [0, 500], [0.07, 0.03]);

  // Generate particles for the background
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;

      // Smooth transition for mouse movement
      setMousePosition((prev) => ({
        x: prev.x + (x - prev.x) * 0.1,
        y: prev.y + (y - prev.y) * 0.1,
      }));
    };

    const interval = setInterval(() => {
      setMousePosition((prev) => ({
        x: prev.x,
        y: prev.y,
      }));
    }, 1000 / 60); // 60fps update

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          y: backgroundY,
          opacity: backgroundOpacity,
        }}
      />

      {/* Animated grid pattern */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          y: useTransform(scrollY, [0, 500], [0, -50]),
          opacity: gridOpacity,
        }}
      />

      {/* Particles with glow */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.size / 2}px rgba(120, 170, 255, 0.6)`,
          }}
          animate={{
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`, `${particle.x}%`],
            y: [`${particle.y}%`, `${particle.y + (Math.random() * 10 - 5)}%`, `${particle.y}%`],
            opacity: [0.1, 0.7, 0.1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Primary animated glow following mouse */}
      <motion.div
        className="absolute"
        style={{
          width: "100vw",
          height: "100vh",
          background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          left: `-50vw`,
          top: `-50vh`,
          x: `calc(${mousePosition.x * 100}% + 0px)`,
          y: `calc(${mousePosition.y * 100}% + 0px)`,
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary glow with different color */}
      <motion.div
        className="absolute"
        style={{
          width: "70vw",
          height: "70vh",
          background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
          left: `-35vw`,
          top: `-35vh`,
          x: `calc(${mousePosition.x * 100}% - 50px)`,
          y: `calc(${mousePosition.y * 100}% - 50px)`,
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Floating light streaks */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            style={{
              width: `${Math.random() * 20 + 15}%`,
              top: `${Math.random() * 100}%`,
              left: `-30%`,
            }}
            animate={{
              x: ["0%", "130%"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Depth overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
};

export default InteractiveBackground;
