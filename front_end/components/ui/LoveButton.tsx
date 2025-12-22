"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Interface untuk objek hati yang terbang
interface Heart {
  id: number;
  x: number;
}

// --- ANIMASI NEON HEARTBEAT ---
const neonHeartbeat: Variants = {
  idle: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(214, 101, 141, 0)",
  },
  animate: {
    scale: [1, 1.05, 1], // Denyut pelan (membesar dikit)
    boxShadow: [
      "0px 0px 0px rgba(214, 101, 141, 0)",       // Mati
      "0px 0px 15px rgba(214, 101, 141, 0.8)",     // Glow Terang Magenta
      "0px 0px 30px rgba(214, 101, 141, 0.4)",     // Glow Melebar (Bloom)
      "0px 0px 0px rgba(214, 101, 141, 0)"         // Mati
    ],
    transition: {
      duration: 2, // Durasi 2 detik per siklus denyut
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.9,
    boxShadow: "0px 0px 50px rgba(214, 101, 141, 1)", // Meledak cahayanya saat diklik
    transition: { duration: 0.1 }
  }
};

const LoveButton = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  
  // Fungsi nambah hati saat diklik
  const handleClick = () => {
    const newHeart = {
      id: Date.now(),
      x: Math.random() * 40 - 20, // Gerak random kiri-kanan sedikit
    };
    
    setHearts((prev) => [...prev, newHeart]);

    // Hapus hati dari memori setelah 1 detik
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      
      {/* AREA ANIMASI HATI TERBANG */}
      <div className="relative w-full h-0">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
              animate={{ 
                opacity: 0, 
                y: -150, // Terbang ke atas
                x: heart.x, 
                scale: 1.5 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl pointer-events-none text-magenta drop-shadow-[0_0_5px_rgba(214,101,141,0.8)]"
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* TOMBOL UTAMA (DENGAN EFEK NEON) */}
      <motion.button
        variants={neonHeartbeat}
        initial="idle"
        animate="animate"
        whileTap="tap"
        whileHover={{ scale: 1.1, cursor: "pointer" }}
        onClick={handleClick}
        // Style dasar: Bulat putih dengan border hitam tebal
        className="relative w-14 h-14 bg-white border-4 border-black rounded-full flex items-center justify-center group"
      >
        {/* Icon Hati */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          // Icon hati berubah jadi pink saat di-hover
          className="w-8 h-8 text-magenta group-hover:text-magenta transition-colors duration-200"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </motion.button>
      
    </div>
  );
};

export default LoveButton;