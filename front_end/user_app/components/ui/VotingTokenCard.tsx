// components/ui/VotingTokenCard.tsx
"use client";
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface VotingTokenProps {
  tokenString: string; // String rahasia untuk QR
  userName: string;
  userNIM: string;
}

const VotingTokenCard = ({ tokenString, userName, userNIM }: VotingTokenProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Container Kartu */}
      <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        {/* Hiasan Bolongan Tiket (Kiri & Kanan) */}
        <div className="absolute top-1/2 -left-4 w-8 h-8 bg-[#fdf8f4] rounded-full border-r-4 border-black transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-4 w-8 h-8 bg-[#fdf8f4] rounded-full border-l-4 border-black transform -translate-y-1/2"></div>

        {/* Header Kartu */}
        <div className="border-b-4 border-black border-dashed pb-4 mb-6 text-center">
          <h3 className="font-roster text-2xl uppercase">Voting Pass</h3>
          <p className="font-mono text-xs text-gray-500">NORDBYTE ELECTION 2025</p>
        </div>

        {/* Area QR Code */}
        <div className="flex flex-col items-center gap-4">

          {/* Wrapper QR dengan Fitur Blur (Privacy) */}
          <div
            className="relative group cursor-pointer"
            onClick={() => setIsRevealed(!isRevealed)}
          >
            <div className={`transition-all duration-300 ${isRevealed ? 'blur-none' : 'blur-lg opacity-20'}`}>
              <QRCodeSVG
                value={tokenString}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>

            {/* Overlay jika belum di-reveal */}
            {!isRevealed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black text-white font-mono text-xs px-3 py-1 animate-pulse">
                  [ CLICK TO REVEAL ]
                </div>
              </div>
            )}
          </div>

          <div className="text-center font-mono mt-2">
            <p className="font-bold text-lg">{userName}</p>
            <div className="bg-black text-white px-2 inline-block">
              {userNIM}
            </div>
          </div>

          <p className="text-[10px] text-red-500 font-bold mt-2 border-2 border-red-500 px-2 py-1 uppercase">
            Do not share this QR Code
          </p>

        </div>

      </div>
    </div>
  );
};

export default VotingTokenCard;