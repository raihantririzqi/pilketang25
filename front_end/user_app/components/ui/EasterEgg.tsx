"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface EasterEggProps {
  trigger: boolean;
  onComplete: () => void;
}

const colors = ["#e84797", "#ff69b4", "#ff1493", "#dc143c", "#ff6b6b", "#ffd700"];

const EasterEgg = ({ trigger, onComplete }: EasterEggProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    // Hanya 20 particles untuk performa
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30, // Center spread
        y: 40 + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 8,
      });
    }
    setParticles(newParticles);

    // Auto cleanup setelah 2 detik
    setTimeout(() => {
      setParticles([]);
      onComplete();
    }, 2000);
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      generateParticles();
    }
  }, [trigger, generateParticles]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              initial={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                top: `${particle.y + (Math.random() - 0.5) * 60}%`,
                left: `${particle.x + (Math.random() - 0.5) * 40}%`,
                scale: [0, 1.5, 1],
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
            >
              {/* Heart shape */}
              <svg
                width={particle.size}
                height={particle.size}
                viewBox="0 0 24 24"
                fill={particle.color}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}

          {/* Flash overlay */}
          <motion.div
            className="absolute inset-0 bg-pink-200"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Secret Message */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-retro text-magenta text-lg lg:text-2xl text-center">
                Peduli Hati!
              </p>
              <p className="font-retro text-black/60 text-xs lg:text-sm text-center mt-1">
                Satu Suara Satu Angkatan
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EasterEgg;
