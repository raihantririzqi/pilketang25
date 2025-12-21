"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PixelLoaderProps {
  onComplete: () => void;
}

const loadingTexts = [
  "INITIALIZING SYSTEM...",
  "LOADING ASSETS...",
  "CHECKING MEMORY...",
  "ESTABLISHING CONNECTION...",
  "ACCESS GRANTED."
];

const PixelLoader = ({ onComplete }: PixelLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Simulasi Progress Bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Delay sedikit sebelum hilang
          return 100;
        }
        
        // Random increment agar terlihat natural seperti loading komputer jadul
        const jump = Math.floor(Math.random() * 10) + 1; 
        return Math.min(prev + jump, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Ganti teks berdasarkan progress
  useEffect(() => {
    const totalTexts = loadingTexts.length;
    const step = 100 / totalTexts;
    const currentStep = Math.floor(progress / step);
    setTextIndex(Math.min(currentStep, totalTexts - 1));
  }, [progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white font-mono"
      initial={{ opacity: 1 }}
      exit={{ y: -1000, transition: { duration: 0.8, ease: "easeInOut" } }} // Efek layar terangkat ke atas
    >
      {/* Scanline Effect (Opsional untuk nuansa Retro TV) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <div className="w-full max-w-md px-8 flex flex-col gap-6 relative z-10">
        
        {/* LOGO PIXEL ART SEDERHANA */}
        <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#D6658D]">
                <span className="text-2xl font-bold animate-pulse">NB</span>
            </div>
        </div>

        {/* LOADING TEXT */}
        <div className="flex justify-between items-end text-sm md:text-base font-bold uppercase tracking-widest text-[#D6658D]">
          <span>{loadingTexts[textIndex]}</span>
          <span>{progress}%</span>
        </div>

        {/* PIXEL PROGRESS BAR */}
        <div className="w-full h-8 border-4 border-white p-1 flex items-center shadow-[4px_4px_0px_0px_#ffffff]">
          {/* Kita gunakan div width % tapi dengan background pattern agar terlihat kotak-kotak */}
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          >
             {/* Pattern Garis-garis agar terlihat seperti blok pixel */}
             <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
          </div>
        </div>

        {/* SYSTEM ID */}
        <div className="text-xs text-gray-500 text-center mt-2">
            SYSTEM_ID: NORDBYTE_V1.0.0_BETA
        </div>

      </div>
    </motion.div>
  );
};

export default PixelLoader;