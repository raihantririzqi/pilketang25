"use client";

import { useState } from "react";
import Image from "next/image";
// 1. Import Motion
import { motion } from "framer-motion";

interface CandidateCardProps {
  name: string;
  nim: string;
  base_color: string;
  kandidat_number: number;
  vision: string;
  missions: string[];
  imageSrc: string;
}

// --- DEFINISI ANIMASI IDLE ---

// 1. Animasi Foto Melayang (Living Portrait)
const photoFloatAnimation = {
  y: [0, -8, 0], // Bergerak naik 8px lalu turun
  transition: {
    duration: 4, // Durasi lambat agar elegan
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// 2. Animasi Segitiga Memantul (Alert Indicator)
const triangleBounce = {
  x: [0, 5, 0], // Bergerak ke kanan-kiri (menunjuk nama)
  transition: {
    duration: 0.8,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// Mapping warna untuk Tailwind (harus explicit agar tidak di-purge)
const colorMap: Record<string, { bg: string; borderLeft: string }> = {
  red: { bg: "bg-red", borderLeft: "border-l-red" },
  magenta: { bg: "bg-magenta", borderLeft: "border-l-magenta" },
  navy: { bg: "bg-navy", borderLeft: "border-l-navy" },
  green: { bg: "bg-green", borderLeft: "border-l-green" },
  yellow: { bg: "bg-yellow", borderLeft: "border-l-yellow" },
};

const CandidateCard = ({
  name,
  nim,
  base_color,
  kandidat_number,
  vision,
  missions,
  imageSrc,
}: CandidateCardProps) => {
  const [showVision, setShowVision] = useState(false);
  const colors = colorMap[base_color] || colorMap.navy;

  return (
    <button
      type="button"
      onClick={() => setShowVision(!showVision)}
      className="group relative cursor-pointer w-72 h-[30rem] lg:w-96 lg:h-[35rem] flex items-center justify-center mt-4 mb-4 mx-4 text-left focus:outline-none"
    >
      {/* Background Decoration (Static CSS) */}
      <div
        className={`absolute ${colors.bg} w-72 h-[30rem] lg:h-[35rem] lg:w-96 translate-x-4 translate-y-4 border-4`}
      />
      <div className="absolute bg-black w-72 h-[30rem] lg:h-[35rem] lg:w-96 translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform group-active:translate-x-4 group-active:translate-y-4" />

      {/* Main Card (Static CSS Hover Wrapper) */}
      <div className="flex flex-col absolute bg-white w-72 h-[30rem] lg:h-[35rem] lg:w-96 border-4 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform group-active:translate-x-4 group-active:translate-y-4 overflow-hidden">
        {!showVision ? (
          /* ================= FRONT (KANDIDAT) ================= */
          <>
            {/* Header */}
            <div className={`${colors.bg} w-full h-24 border-b-4 flex items-center`}>
              <span className="text-white font-bold text-3xl ml-4 font-retro drop-shadow-md">
                {kandidat_number}P
              </span>
            </div>

            {/* Body */}
            <div className="w-full h-full flex">
              {/* Sidebar Nama */}
              <div className="w-16 h-full flex items-center justify-center bg-white overflow-hidden border-r-4">
                <div className="flex items-center gap-8 -rotate-90 whitespace-nowrap">
                  <span className="font-retro text-xl">{name}</span>
                  <div className="bg-yellow px-3 py-1 rounded-lg">
                    <span className="font-bold font-mono tracking-widest text-sm text-white">
                      {nim}
                    </span>
                  </div>
                </div>
              </div>

              {/* Foto Container */}
              <div className="h-full w-full flex justify-center p-4 bg-gray-50">
                <div className="relative w-full h-full bg-white border-4 overflow-hidden shadow-inner">

                  {/* --- ANIMASI FOTO (WRAPPER) --- */}
                  {/* Kita bungkus Image dengan motion.div agar fotonya bergerak halus */}
                  <motion.div
                    className="relative w-full h-full"
                    animate={photoFloatAnimation} // Pasang animasi di sini
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={`Foto ${name}`}
                        fill
                        unoptimized
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-mono text-xs">
                        NO_IMAGE_SIGNAL
                      </div>
                    )}

                  </motion.div>

                  {/* Overlay Nama File (.exe style) */}
                  <div className="absolute w-full border-t-4 h-12 bottom-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 shadow-lg">

                    {/* --- ANIMASI SEGITIGA --- */}
                    <motion.div
                      animate={triangleBounce}
                      className={`mr-4 w-0 h-0
                        border-t-[10px] border-t-transparent
                        border-b-[10px] border-b-transparent
                        border-l-[15px] ${colors.borderLeft}`}
                    >
                    </motion.div>

                    {/* Teks Nama File */}
                    <span className="font-retro text-xs lg:text-sm truncate max-w-[150px] text-black">
                      {name.split(" ")[0].toLowerCase()}.exe
                    </span>

                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ================= BACK (VISI & MISI) ================= */
          <div className="flex flex-col h-full p-4 bg-[#fdfdfd]">
            <div className="border-b-4 pb-2 mb-4 border-black/10">
              <h3 className="font-retro text-xl leading-tight">{name}</h3>
              <span className="font-mono text-xs text-gray-500">{nim}</span>
            </div>

            <div className="flex-1 overflow-auto space-y-4 font-mono text-sm pr-1 scrollbar-hide">
              <div>
                <span className="inline-block mb-2 bg-blue-400 text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase">
                  Visi_
                </span>
                <p className="leading-relaxed text-gray-800">{vision}</p>
              </div>

              <div>
                <span className="inline-block mb-2 bg-green-400 text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase">
                  Misi_
                </span>
                <ul className="list-decimal list-inside space-y-2 text-gray-800">
                  {missions.map((item, index) => (
                    <li key={index} className="pl-1 marker:font-bold">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-gray-400 mt-2 animate-pulse">
              [ click_to_flip ]
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default CandidateCard;