"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const FloatingHearts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(800);

  // Generate hearts once with useMemo (lebih ringan)
  const hearts = useMemo(() => {
    const newHearts: Heart[] = [];
    // Kurangi jumlah hearts: 25 -> 12 untuk performa
    for (let i = 0; i < 12; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 16 + 12, // 12-28px
        duration: Math.random() * 8 + 12, // 12-20s (lebih lambat = lebih smooth)
        delay: Math.random() * 8,
        opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
      });
    }
    return newHearts;
  }, []);

  useEffect(() => {
    // Delay render untuk tidak block initial paint
    const timer = setTimeout(() => {
      setIsVisible(true);
      setWindowHeight(window.innerHeight);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Jangan render sampai client ready
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Floating Hearts - Optimized */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute will-change-transform"
          style={{
            left: `${heart.x}%`,
            bottom: "-30px",
          }}
          animate={{
            y: [0, -windowHeight - 50],
            x: [0, Math.sin(heart.id) * 30, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Simple SVG Heart - tanpa nested animation */}
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="#e84797"
            style={{ opacity: heart.opacity }}
            className="will-change-transform"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      {/* Ambient Glow - Reduced blur for better performance */}
      <div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-pink-400/10 blur-[60px] animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-magenta/10 blur-[50px] animate-pulse"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      />
    </div>
  );
};

export default FloatingHearts;
