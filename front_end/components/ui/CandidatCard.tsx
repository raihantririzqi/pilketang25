"use client";
import { useState } from "react";
// 1. Import Image dari Next.js
import Image from "next/image";

interface CandidateCardProps {
  name: string;
  nim: string;
  base_color: string;
  kandidat_number: number;
  vision: string;
  missions: string[];
  imageSrc: string; // 2. Tambahkan properti imageSrc
}

const CandidateCard = ({
  name,
  nim,
  base_color,
  kandidat_number,
  vision,
  missions,
  imageSrc, // Destructure imageSrc
}: CandidateCardProps) => {
  const [showVision, setShowVision] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setShowVision(!showVision)}
      className="group relative cursor-pointer w-72 h-[30rem] md:w-96 md:h-[35rem] flex items-center justify-center mt-4 mb-4 mx-4 text-left"
    >
      {/* Background Decoration */}
      <div
        className={`absolute bg-${base_color} w-72 h-[30rem] md:h-[35rem] md:w-96 translate-x-4 translate-y-4 border-4`}
      />
      <div className="absolute bg-black w-72 h-[30rem] md:h-[35rem] md:w-96 translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform group-active:translate-x-4 group-active:translate-y-4" />

      {/* Main Card */}
      <div className="flex flex-col absolute bg-white w-72 h-[30rem] md:h-[35rem] md:w-96 border-4 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform group-active:translate-x-4 group-active:translate-y-4 overflow-hidden">
        {!showVision ? (
          /* ================= FRONT (KANDIDAT) ================= */
          <>
            {/* Header */}
            <div className={`bg-${base_color} w-full h-24 border-b-4 flex items-center`}>
              <span className="text-white font-bold text-3xl ml-4 font-retro">
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
              <div className="h-full w-full flex justify-center p-4">
                {/* 3. Implementasi Image */}
                <div className="relative w-full h-full bg-gray-100 border-4 overflow-hidden">
                  
                  {/* Komponen Gambar */}
                  {/* <Image 
                    src={imageSrc}
                    alt={`Foto ${name}`}
                    fill
                    className="object-cover object-top" // object-cover agar full, object-top agar wajah (biasanya di atas) tidak terpotong
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  /> */}

                  {/* Overlay Nama File (.exe style) - Diberi z-10 agar di atas gambar */}
                  <div className="absolute w-full border-t-4 h-12 bottom-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                    
                    {/* Segitiga Indikator */}
                    <div className={`mr-4 w-0 h-0 
                    border-t-[10px] border-t-transparent 
                    border-b-[10px] border-b-transparent 
                    border-l-[15px] ${base_color === 'magenta' ? 'border-l-magenta' : base_color === 'navy' && 'border-l-navy'}`}>
                    </div>

                    {/* Teks Nama File */}
                    <span className="font-retro text-xs md:text-sm truncate max-w-[150px]">
                        {name.split(" ")[0].toLowerCase()}.exe
                    </span>

                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ================= BACK (VISI & MISI) ================= */
          <div className="flex flex-col h-full p-4">
            <div className="border-b-4 pb-2 mb-4">
              <h3 className="font-retro text-xl">{name}</h3>
              <span className="font-mono text-xs">{nim}</span>
            </div>

            <div className="flex-1 overflow-auto space-y-4 font-mono text-sm pr-1 scrollbar-hide">
              <div>
                <span className="inline-block mb-1 bg-blue-400 text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Visi
                </span>
                <p className="leading-relaxed">{vision}</p>
              </div>

              <div>
                <span className="inline-block mb-1 bg-green-400 text-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Misi
                </span>
                <ul className="list-decimal list-inside space-y-1">
                  {missions.map((item, index) => (
                    <li key={index} className="pl-1 marker:font-bold">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono opacity-60 mt-2">
              [ klik kartu untuk kembali ]
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default CandidateCard;