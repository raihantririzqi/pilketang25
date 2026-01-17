"use client";
import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface TicketData {
  token: string;
  name: string;
  nim: string;
  profile_picture?: string;
}

interface VotingTokenProps {
  ticket: TicketData;
}

const VotingTokenCard = ({ ticket }: VotingTokenProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { token, name, nim, profile_picture } = ticket;

  // --- LOGIKA JSON ARRAY UNTUK SCANNER ---
  // Kita gunakan useMemo agar stringify hanya berjalan jika data berubah
  const qrValue = useMemo(() => {
    return JSON.stringify([nim, name, token, profile_picture]);
  }, [nim, name, token, profile_picture]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        {/* Hiasan Tiket */}
        <div className="absolute top-1/2 -left-4 w-8 h-8 bg-[#fdf8f4] rounded-full border-r-4 border-black transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-4 w-8 h-8 bg-[#fdf8f4] rounded-full border-l-4 border-black transform -translate-y-1/2"></div>

        <div className="border-b-4 border-black border-dashed pb-4 mb-6 text-center">
          <h3 className="font-roster text-2xl uppercase tracking-tighter">Voting Pass</h3>
          <p className="font-mono text-[10px] text-gray-500">PEMIKET SYSTEM // ITERA 2026</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => setIsRevealed(!isRevealed)}
          >
            {/* QR Code dengan Value JSON String */}
            <div className={`transition-all duration-300 ${isRevealed ? 'blur-none' : 'blur-lg opacity-20'}`}>
              <QRCodeSVG
                value={qrValue}
                size={220}
                level="M" // Level Medium cukup untuk data array pendek agar QR tidak terlalu rapat
                includeMargin={true}
              />
            </div>

            {!isRevealed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black text-white font-mono text-[10px] px-4 py-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-pulse">
                  TAP TO UNLOCK QR
                </div>
              </div>
            )}
          </div>

          <div className="text-center font-mono mt-2 w-full">
            <p className="font-bold text-lg uppercase truncate px-2">{name}</p>
            <div className="bg-black text-white px-3 py-0.5 inline-block text-sm">
              {nim}
            </div>
          </div>

          <div className="w-full border-t-2 border-black border-dotted mt-2 pt-2">
            <p className="text-[9px] text-center text-gray-400 font-mono">
              TOKEN_ID: {token.substring(0, 8)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingTokenCard;