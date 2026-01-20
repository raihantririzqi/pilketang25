"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Confetti {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

const colors = ["#e84797", "#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff85a2"];

interface ScrollConfettiProps {
  targetId: string; // ID of section to watch
}

const ScrollConfetti = ({ targetId }: ScrollConfettiProps) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasTriggered.current) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.7;

      if (isVisible) {
        hasTriggered.current = true;
        triggerConfetti();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  const triggerConfetti = () => {
    const newConfetti: Confetti[] = [];

    // Generate 15 confetti pieces (ringan)
    for (let i = 0; i < 15; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 16 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      });
    }

    setConfetti(newConfetti);

    // Cleanup after animation
    setTimeout(() => {
      setConfetti([]);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
          {confetti.map((item) => (
            <motion.div
              key={item.id}
              className="absolute"
              initial={{
                left: `${item.x}%`,
                top: "-5%",
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                top: "110%",
                rotate: item.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5 + Math.random(),
                ease: "easeIn",
              }}
            >
              <svg
                width={item.size}
                height={item.size}
                viewBox="0 0 24 24"
                fill={item.color}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScrollConfetti;
