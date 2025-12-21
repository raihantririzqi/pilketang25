"use client";
import { useState } from "react";

interface CandidateCardProps {
  name: string;
  nim: string;
  base_color: string;
  kandidat_number: number;
  vision: string;
  missions: string[];
}


const CandidateCard = ({
  name,
  nim,
  base_color,
  kandidat_number,
  vision,
  missions
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
              <div className="w-16 h-full flex items-center justify-center bg-white overflow-hidden">
                <div className="flex items-center gap-8 -rotate-90 whitespace-nowrap">
                  <span className="font-retro text-xl">{name}</span>
                  <div className="bg-yellow px-3 py-1 rounded-lg">
                    <span className="font-bold font-mono tracking-widest text-sm text-white">
                      {nim}
                    </span>
                  </div>
                </div>
              </div>

              {/* Foto / Placeholder */}
              <div className="h-full w-full flex justify-center p-4">
                <div className="relative w-full h-full bg-gray-300 border-4">
                  <div className="absolute w-full border-t-4 h-12 bottom-0 backdrop-blur-sm flex items-center justify-center" >
                    {/* Segitiga */}
                    <div className={`mr-4 w-0 h-0 
                    border-t-[10px] border-t-transparent 
                    border-b-[10px] border-b-transparent 
                    border-l-[15px] border-l-${base_color}`}>
                    </div>

                    {/* Teks */}
                    <span className="font-retro">{name.toLowerCase().replace(/\s+/g, "_")}.exe</span>

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

            <div className="flex-1 overflow-auto space-y-4 font-mono text-sm pr-1">
              <div>
                <span className="inline-block mb-1 bg-blue-400 text-white px-2 py-1 border-2">
                  Visi
                </span>
                <p>{vision}</p>
              </div>

              <div>
                <span className="inline-block mb-1 bg-green-400 text-white px-2 py-1 border-2">
                  Misi
                </span>
                <ul className="list-decimal list-inside space-y-1">
                  {missions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>


            <div className="text-right text-[10px] font-mono opacity-60">
              klik untuk kembali
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default CandidateCard;
