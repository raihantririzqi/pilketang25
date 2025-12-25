"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import Router
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';

// Tipe data simulasi untuk hasil scan
interface ScannedUser {
    token: string;
    name: string;
    nim: string;
    status: 'VERIFIED' | 'UNKNOWN';
    timestamp: string;
}

const SecurityScanner = () => {
    const router = useRouter(); // 2. Init Router
    const [scanResult, setScanResult] = useState<ScannedUser | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false); // 3. State untuk animasi loading redirect
    const [logs, setLogs] = useState<string[]>(["> System initialized...", "> Camera Module loaded [OK]"]);

    const addLog = (message: string) => {
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        setLogs(prev => [`[${time}] ${message}`, ...prev].slice(0, 8));
    };

    const handleScan = (detectedCodes: any) => {
        if (detectedCodes && detectedCodes.length > 0 && isScanning) {
            const rawValue = detectedCodes[0].rawValue;

            if (rawValue) {
                // Hentikan scanning
                setIsScanning(false);
                addLog(`Token detected: ${rawValue.substring(0, 8)}...`);
                addLog("Verifying identity hash...");

                // SIMULASI BACKEND VALIDATION
                setTimeout(() => {
                    const mockUser: ScannedUser = {
                        token: rawValue,
                        name: "RAIHAN TRI RIZQI", 
                        nim: "123456789",         
                        status: 'VERIFIED',
                        timestamp: new Date().toLocaleString()
                    };

                    setScanResult(mockUser);
                    addLog(`ACCESS GRANTED: ${mockUser.name}`);
                    
                    // 4. MULAI PROSES REDIRECT
                    startRedirection(mockUser);

                }, 800);
            }
        }
    };

    // Fungsi Khusus Redirect
    const startRedirection = (user: ScannedUser) => {
        setIsRedirecting(true);
        addLog("Initiating Voting Protocol...");
        addLog("Redirecting in 3s...");

        // Delay 3 detik agar user sempat lihat foto/namanya
        setTimeout(() => {
            // Arahkan ke halaman voting
            // Opsional: Bawa token/nim via query param
            router.push(`/voting?token=${user.token}`); 
        }, 3000);
    };

    const handleReset = () => {
        setScanResult(null);
        setIsScanning(true);
        setIsRedirecting(false);
        addLog("Ready for next scan...");
    };

    const handleError = (error: any) => {
        console.error(error);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            
            {/* HEADER (Sama seperti sebelumnya) */}
            <div className="flex justify-between items-end mb-4 border-b-2 border-black pb-2">
                <div>
                    <h1 className="font-roster text-3xl md:text-4xl text-black">GATE_CONTROL_V1</h1>
                    <p className="font-mono text-xs md:text-sm text-gray-600">PEMIKET SECURITY PROTOCOL // INFORMATIKA 2025</p>
                </div>
                <div className="flex gap-4 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        {/* Indikator Status Sistem */}
                        <span className={`w-3 h-3 rounded-full ${isRedirecting ? 'bg-blue-500 animate-ping' : isScanning ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                        <span>{isRedirecting ? 'REDIRECTING...' : isScanning ? 'SYSTEM READY' : 'PROCESSING'}</span>
                    </div>
                    <div>UPTIME: 00:42:12</div>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] lg:h-[600px]">

                {/* === KOLOM KIRI: CAMERA === */}
                <div className="lg:col-span-2 relative bg-black border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                    <div className="bg-gray-900 text-green-500 px-4 py-2 font-mono text-xs flex justify-between items-center border-b border-gray-700 z-20">
                        <span>CAM_SOURCE: WEBCAM_INTERNAL</span>
                        <span className="border border-green-500 px-2 rounded text-[10px]">HD_720p</span>
                    </div>

                    <div className="relative flex-1 bg-gray-800 w-full h-full overflow-hidden">
                        <Scanner 
                            onScan={handleScan} 
                            onError={handleError}
                            components={{ finder: false }}
                            styles={{ 
                                container: { width: '100%', height: '100%' },
                                video: { objectFit: 'cover', width: '100%', height: '100%' }
                            }}
                        />

                        {/* Overlay Camera UI */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="w-full h-full opacity-20 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                            
                            {/* Focus Brackets */}
                            <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-white/50"></div>
                            <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-white/50"></div>
                            <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-white/50"></div>
                            <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-white/50"></div>

                            {/* Target Box & Laser */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 rounded-lg">
                                {isScanning && (
                                    <motion.div
                                        className="w-full h-1 bg-red-500 shadow-[0_0_15px_red]"
                                        animate={{ y: [0, 250, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </div>

                            {/* Status Overlay saat Processing/Redirecting */}
                            {(!isScanning || isRedirecting) && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                    {isRedirecting ? (
                                        <>
                                            <div className="text-blue-400 font-mono text-xl animate-pulse">INITIATING VOTING SEQUENCE...</div>
                                            {/* Loading Bar */}
                                            <div className="w-64 h-2 bg-gray-700 rounded overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-blue-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 3 }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-white font-mono text-xl animate-pulse">ANALYZING BIOMETRICS...</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* === KOLOM KANAN: INFO PANEL === */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* RESULT CARD */}
                    <div className="flex-1 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 ${isRedirecting ? 'bg-blue-500' : 'bg-magenta'}`}></div>
                        <h2 className="font-bold font-retro text-xl mb-4 text-black border-b-2 border-gray-200 pb-2">
                            IDENTITY_CHECK
                        </h2>

                        <AnimatePresence mode='wait'>
                            {scanResult ? (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4 h-full"
                                >
                                    {/* Photo Profile */}
                                    <div className="w-32 h-32 bg-gray-200 border-4 border-black rounded-full overflow-hidden relative">
                                        <div className="w-full h-full bg-navy flex items-center justify-center text-white text-4xl font-bold">
                                            {scanResult.name.charAt(0)}
                                        </div>
                                        <div className="absolute bottom-0 w-full h-8 bg-green-500 flex items-center justify-center text-[10px] font-bold text-white">
                                            VERIFIED
                                        </div>
                                    </div>

                                    <div className="text-center w-full">
                                        <div className="text-gray-500 text-xs font-mono mb-1">NAME_REGISTRY</div>
                                        <div className="text-xl font-bold text-black uppercase leading-tight">{scanResult.name}</div>
                                    </div>

                                    <div className="text-center w-full">
                                        <div className="text-gray-500 text-xs font-mono mb-1">NIM_ID</div>
                                        <div className="text-2xl text-magenta">{scanResult.nim}</div>
                                    </div>

                                    {/* Pesan Redirect */}
                                    <div className="mt-auto w-full text-center">
                                        {isRedirecting ? (
                                            <div className="bg-blue-100 border-2 border-blue-500 text-blue-800 py-3 font-mono text-xs rounded animate-pulse">
                                                REDIRECTING TO VOTING PAGE...
                                            </div>
                                        ) : (
                                            <div className="text-green-600 font-bold text-sm">
                                                ✓ IDENTITY CONFIRMED
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50"
                                >
                                    <svg className="w-20 h-20 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    <span className="font-mono text-sm">WAITING FOR QR TOKEN...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* TERMINAL LOGS */}
                    <div className="h-48 bg-black p-3 font-mono text-xs border-4 border-gray-700 overflow-y-auto rounded-sm shadow-inner">
                        <div className="text-green-500 mb-2 border-b border-gray-800 pb-1 font-bold">
                            {"> SYSTEM_LOGS.txt"}
                        </div>
                        <div className="flex flex-col gap-1">
                            {logs.map((log, i) => (
                                <div key={i} className={`${i === 0 ? 'text-white font-bold' : 'text-gray-500'}`}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default SecurityScanner;