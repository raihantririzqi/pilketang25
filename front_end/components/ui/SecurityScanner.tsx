// components/ui/SecurityScanner.tsx
"use client";

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion } from 'framer-motion';

const SecurityScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('SCANNING');

  const handleScan = (detectedCodes: any) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const rawValue = detectedCodes[0].rawValue;
      
      // Simulasi Validasi (Di sini nanti logika cek ke database)
      if (rawValue) {
        setScanResult(rawValue);
        setStatus('SUCCESS');
        
        // Reset scanner setelah 3 detik (opsional)
        setTimeout(() => {
            setScanResult(null);
            setStatus('SCANNING');
        }, 3000);
      }
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    setStatus('ERROR');
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6">
      
      {/* --- SCANNER FRAME --- */}
      <div className="relative bg-black p-2 border-4 border-gray-600 rounded-lg shadow-2xl">
        
        {/* Header Terminal */}
        <div className="bg-gray-800 text-xs font-mono text-gray-300 p-2 flex justify-between mb-1">
            <span>CAM_01: ACTIVE</span>
            <span className="animate-pulse text-green-500">● REC</span>
        </div>

        {/* Area Kamera */}
        <div className="relative border-2 border-gray-700 overflow-hidden h-64 md:h-80 bg-gray-900">
            
            {/* Library Scanner */}
            <Scanner 
                onScan={handleScan} 
                onError={handleError}
                components={{ finder: false }} // Finder bawaan dimatikan, kita buat sendiri
                styles={{ container: { width: '100%', height: '100%' } }}
            />

            {/* --- CUSTOM OVERLAY (HUD) --- */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                
                {/* 1. Kotak Fokus (Corner Brackets) */}
                <div className="w-48 h-48 relative opacity-70">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                </div>

                {/* 2. Animasi Laser Scanning */}
                {status === 'SCANNING' && (
                    <motion.div
                        className="absolute w-64 h-1 bg-red-500/80 shadow-[0_0_15px_rgba(255,0,0,0.8)]"
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                )}

                {/* 3. Overlay Status Sukses */}
                {status === 'SUCCESS' && (
                    <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-black border-4 border-green-500 p-4 text-center"
                        >
                            <div className="text-green-500 font-bold text-2xl font-roster">ACCESS GRANTED</div>
                            <div className="text-white font-mono text-xs mt-1">TOKEN VERIFIED</div>
                        </motion.div>
                    </div>
                )}

            </div>

            {/* Grid Overlay (Efek CCTV) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,0,0.06),rgba(255,0,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-20"></div>

        </div>

        {/* Footer Status Log */}
        <div className="mt-2 bg-black border border-gray-700 p-3 font-mono text-xs h-24 overflow-y-auto">
            <div className="text-gray-500">System Logs:</div>
            <div className="text-green-400">{`> Camera initialized... [OK]`}</div>
            <div className="text-green-400">{`> Waiting for token...`}</div>
            
            {scanResult && (
                <div className="mt-2">
                    <span className="text-yellow-400">{`> Token Detected:`}</span>
                    <br />
                    <span className="text-white break-all">{scanResult}</span>
                </div>
            )}
        </div>

      </div>

    </div>
  );
};

export default SecurityScanner;