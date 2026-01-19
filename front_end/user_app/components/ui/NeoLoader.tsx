"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface NeoLoaderProps {
  onComplete: () => void;
}

const loadingTexts = [
  "MENYIAPKAN BILIK SUARA...",
  "MENGECEK DAFTAR PEMILIH...",
  "MELIPAT KERTAS SUARA...",
  "MENGAMANKAN KOTAK SUARA...",
  "PEDULI HATI SIAP!"
];

const NeoLoader = ({ onComplete }: NeoLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // 1. CEK SESSION STORAGE
    // Apakah user sudah pernah melihat loader di sesi ini?
    const hasSeenLoader = sessionStorage.getItem("has_seen_loader");

    if (hasSeenLoader) {
      // Jika sudah, langsung hilangkan loader tanpa animasi
      setShouldRender(false);
      onComplete();
      return;
    }

    // 2. JIKA BELUM, JALANKAN LOADING
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Simpan tanda bahwa user sudah melihat loader
          sessionStorage.setItem("has_seen_loader", "true");
          
          setTimeout(onComplete, 500); 
          return 100;
        }
        
        const jump = Math.floor(Math.random() * 15) + 5; // Lebih cepat sedikit
        return Math.min(prev + jump, 100);
      });
    }, 100); // Interval lebih cepat biar kerasa ringan

    return () => clearInterval(interval);
  }, [onComplete]);

  // Ganti teks
  useEffect(() => {
    const totalTexts = loadingTexts.length;
    const step = 100 / totalTexts;
    const currentStep = Math.floor(progress / step);
    setTextIndex(Math.min(currentStep, totalTexts - 1));
  }, [progress]);

  // Jika tidak perlu render (karena sudah pernah load), kembalikan null
  if (!shouldRender) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center font-retro overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%", 
        transition: { duration: 0.6, ease: "easeInOut" } // Durasi dipercepat sedikit
      }} 
    >
      {/* --- BACKGROUND DECORATION --- */}
      {/* Bola-bola dihapus sesuai request, sisa pola titik halus saja */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>
      
      <div className="w-full max-w-md px-8 flex flex-col items-center gap-8 relative z-10">
        
        {/* LOGO UTAMA (Tanpa Animasi Loop biar Ringan) */}
        <div className="w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
             <Image 
                src="/images/logo_pemiket.png" 
                alt="Logo" 
                width={60} 
                height={60} 
                className="object-contain"
                priority // Load prioritas agar tidak kedip
             />
        </div>

        {/* CONTAINER LOADING BAR */}
        <div className="w-full flex flex-col gap-2">
            
            {/* Teks Status */}
            <div className="flex justify-between items-end font-roster text-lg md:text-xl text-black uppercase tracking-wide">
                <span className="truncate mr-2">{loadingTexts[textIndex]}</span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-10 border-4 border-black rounded-full bg-white relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <motion.div 
                    className="h-full bg-[#2c9f45] border-r-4 border-black relative"
                    style={{ width: `${progress}%` }}
                    // Menggunakan layout animation framer motion yang smooth
                    layout 
                >
                    {/* Pattern Garis Diagonal Ringan */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
                </motion.div>
            </div>

            {/* Persentase Badge */}
            <div className="self-end mt-2">
                <div className="bg-black text-white font-bold px-3 py-1 rounded-lg border-2 border-black transform rotate-2 shadow-[2px_2px_0px_0px_#D6658D]">
                    {progress}%
                </div>
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export default NeoLoader;