"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import { useVotingStore } from '@/store/useVotingStore';
import api from '@/lib/axios';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface ScannedUser {
    token: string;
    name: string;
    nim: string;
    profile_picture: string;
    status: 'VERIFIED' | 'UNKNOWN';
    timestamp: string;
}

const SecurityScanner = () => {
    const router = useRouter();
    const {
        votingToken,
        setSession,
        clearSession,
        setLoading,
        setError,
        isLoading,
        error
    } = useVotingStore();

    const [scanResult, setScanResult] = useState<ScannedUser | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

    // Logic: Simpan data API di sini dulu, jangan di Store global agar /voting tidak bisa diakses manual
    const [pendingSession, setPendingSession] = useState<{ voting_token: string; candidates: any[] } | null>(null);

    const [logs, setLogs] = useState<string[]>(["> System initialized...", "> Camera Module loaded [OK]"]);
    const isProcessing = useRef(false);

    // Mencegah scanner tetap terbuka jika sudah punya session aktif
    useEffect(() => {
        if (votingToken) {
            router.replace('/voting');
        }
    }, [votingToken, router]);

    const addLog = (message: string) => {
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        setLogs(prev => [`[${time}] ${message}`, ...prev].slice(0, 8));
    };

    const handleScan = async (detectedCodes: any) => {
        if (isProcessing.current) return;

        if (detectedCodes && detectedCodes.length > 0 && !isLoading && !isRedirecting) {
            const rawValue = detectedCodes[0].rawValue;

            if (rawValue) {
                isProcessing.current = true;
                setLoading(true);
                setError(null);
                setScanResult(null);
                addLog(`Raw Data detected. Analyzing...`);

                try {
                    const parsedData = JSON.parse(rawValue);

                    if (Array.isArray(parsedData) && parsedData.length >= 3) {
                        const [extractedNIM, extractedName, extractedToken, extractedProfilePicture] = parsedData;

                        addLog(`Identity: ${extractedNIM}`);
                        addLog("Verifying with Gate Protocol...");

                        const response = await api.post("/voting/validate-qr", {
                            qr_token: extractedToken
                        });

                        // LOGIKA BARU: Simpan ke state lokal dulu (pendingSession)
                        const { voting_token, candidates } = response.data.result;
                        setPendingSession({ voting_token, candidates });

                        const user: ScannedUser = {
                            nim: extractedNIM,
                            name: extractedName,
                            profile_picture: extractedProfilePicture,
                            token: extractedToken,
                            status: 'VERIFIED',
                            timestamp: new Date().toLocaleString()
                        };

                        setScanResult(user);
                        addLog(`ACCESS GRANTED: ${user.name}`);
                        addLog("Menunggu konfirmasi koordinator...");
                        setAwaitingConfirmation(true);
                        setLoading(false);

                    } else {
                        throw new Error("Invalid QR Data Structure");
                    }

                } catch (error: any) {
                    const errorMsg = error.response?.data?.message || "Invalid QR or Connection Error";
                    setError(errorMsg);
                    addLog(`[ERROR] ${errorMsg.toUpperCase()}`);
                    addLog("Resetting scanner sequence...");

                    setTimeout(() => {
                        isProcessing.current = false;
                        setLoading(false);
                        clearSession();
                    }, 3000);
                }
            }
        }
    };

    // LOGIKA BARU: Session baru diset ke Store Global saat tombol diklik
    const handleConfirmIdentity = () => {
        if (!pendingSession) return;

        // Sekarang user resmi punya token, halaman /voting sekarang bisa diakses
        setSession(pendingSession.voting_token, pendingSession.candidates);

        setAwaitingConfirmation(false);
        setIsRedirecting(true);
        addLog("Identitas dikonfirmasi koordinator");
        addLog("Syncing encrypted session data...");
        addLog("Redirecting to voting booth...");

        setTimeout(() => {
            router.push(`/voting`);
            // setIsRedirecting(false); // Opsional karena akan pindah page
        }, 2500);
    };

    const handleRejectIdentity = () => {
        addLog("[REJECTED] Identitas ditolak koordinator");
        addLog("Resetting scanner sequence...");
        setAwaitingConfirmation(false);
        setScanResult(null);
        setPendingSession(null); // Hapus data pending
        clearSession();

        setTimeout(() => {
            isProcessing.current = false;
        }, 1000);
    };

    const handleError = (error: any) => {
        const errorMessage = `[CAM_ERROR] ${error.message || 'Check hardware/permissions'}`;
        addLog(errorMessage);
        setError("Camera Error. Please check permissions and refresh.");
        console.error(error);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-end mb-4 border-b-2 border-black pb-2">
                <div>
                    <h1 className="font-roster text-3xl md:text-4xl text-black">GATE_CONTROL</h1>
                    <p className="font-mono text-xs md:text-sm text-gray-600 uppercase">PEMIKET SECURITY PROTOCOL // INFORMATIKA 2026</p>
                </div>
                <div className="flex gap-4 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isRedirecting ? 'bg-blue-500 animate-ping' : awaitingConfirmation ? 'bg-yellow-500 animate-pulse' : isLoading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <span>{isRedirecting ? 'REDIRECTING...' : awaitingConfirmation ? 'AWAITING CONFIRMATION' : isLoading ? 'PROCESSING...' : error ? 'ERROR' : 'SYSTEM READY'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] lg:h-[600px]">
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

                        <div className="absolute inset-0 pointer-events-none">
                            <div className="w-full h-full opacity-20 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                            <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-white/50"></div>
                            <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-white/50"></div>
                            <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-white/50"></div>
                            <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-white/50"></div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 rounded-lg">
                                {!isLoading && !isRedirecting && !error && (
                                    <motion.div
                                        className="w-full h-1 bg-red-500 shadow-[0_0_15px_red]"
                                        animate={{ y: [0, 250, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </div>

                            {(isLoading || isRedirecting || awaitingConfirmation || error) && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-center p-4">
                                    {isRedirecting ? (
                                        <>
                                            <div className="text-blue-400 font-mono text-xl animate-pulse">INITIATING VOTING SEQUENCE...</div>
                                            <div className="w-64 h-2 bg-gray-700 rounded overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-blue-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 3 }}
                                                />
                                            </div>
                                        </>
                                    ) : awaitingConfirmation ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-yellow-400 font-mono text-xl animate-pulse">IDENTITY VERIFIED</div>
                                            <div className="text-white font-mono text-sm">Menunggu konfirmasi koordinator lapangan...</div>
                                            <div className="flex gap-2 mt-2">
                                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            </div>
                                        </div>
                                    ) : isLoading ? (
                                        <div className="text-white font-mono text-xl animate-pulse">ANALYZING SIGNATURE...</div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="text-red-500 font-mono text-xl">ACCESS DENIED</div>
                                            <p className="text-red-400 font-mono text-sm max-w-sm">{error}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="flex-1 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 ${isRedirecting ? 'bg-blue-500' : error ? 'bg-red-500' : 'bg-magenta'}`}></div>
                        <h2 className="font-bold font-retro text-xl mb-4 text-black border-b-2 border-gray-200 pb-2 uppercase tracking-tighter">
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
                                    <div className="w-32 h-32 bg-gray-200 border-4 border-black rounded-full overflow-hidden relative">
                                        <div className="w-full h-full bg-navy flex items-center justify-center text-white text-4xl font-bold">
                                            <Avatar className="w-32 h-32 rounded-none border-4 border-black bg-[#92c3dd] relative z-10 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                                                <AvatarImage src={scanResult.profile_picture || ""} alt={scanResult.name} className="object-cover group-hover:scale-110 transition-transform duration-300" />
                                                <AvatarFallback className="rounded-none bg-[#92c3dd] font-retro text-5xl text-black uppercase">
                                                    {scanResult.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>                                        </div>
                                        <div className="absolute bottom-0 w-full h-8 bg-green-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                            AUTHORIZED
                                        </div>
                                    </div>

                                    <div className="text-center w-full">
                                        <div className="text-gray-500 text-[10px] font-mono mb-1 uppercase tracking-widest">Name_Registry</div>
                                        <div className="text-xl font-bold text-black uppercase leading-tight">{scanResult.name}</div>
                                    </div>

                                    <div className="text-center w-full">
                                        <div className="text-gray-500 text-[10px] font-mono mb-1 uppercase tracking-widest">NIM_ID</div>
                                        <div className="text-2xl text-magenta font-retro">{scanResult.nim}</div>
                                    </div>

                                    <div className="mt-auto w-full text-center">
                                        {isRedirecting ? (
                                            <div className="bg-blue-100 border-2 border-blue-500 text-blue-800 py-3 font-mono text-[10px] rounded animate-pulse uppercase">
                                                Syncing Voting Booth...
                                            </div>
                                        ) : awaitingConfirmation ? (
                                            <div className="flex flex-col gap-3">
                                                <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-800 py-2 px-3 font-mono text-[10px] rounded uppercase">
                                                    Menunggu Konfirmasi Koordinator
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleRejectIdentity}
                                                        className="flex-1 bg-red-500 text-white font-retro text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-red-600"
                                                    >
                                                        TOLAK
                                                    </button>
                                                    <button
                                                        onClick={handleConfirmIdentity}
                                                        className="flex-1 bg-green-500 text-white font-retro text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-green-600"
                                                    >
                                                        LANJUTKAN
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-green-600 font-bold text-xs font-mono uppercase">
                                                ✓ Identity Confirmed
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center text-gray-400 opacity-50 p-4"
                                >
                                    {error ? (
                                        <div className="flex flex-col items-center text-red-500 opacity-100">
                                            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                            <span className="font-mono text-xs uppercase tracking-[0.3em]">{error}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="w-20 h-20 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                            <span className="font-mono text-xs uppercase tracking-[0.3em]">Waiting for Feed...</span>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-48 bg-black p-3 font-mono text-[10px] border-4 border-gray-700 shadow-inner overflow-hidden">
                        <div className="text-green-500 mb-2 border-b border-gray-800 pb-1 font-bold flex justify-between uppercase">
                            <span>{"> SYSTEM_LOGS.txt"}</span>
                            <span className="animate-pulse">_</span>
                        </div>
                        <div className="flex flex-col gap-1 overflow-y-auto h-32 scrollbar-hide">
                            {logs.map((log, i) => (
                                <div key={i} className={`${i === 0 ? 'text-white font-bold' : 'text-gray-500'} ${log.startsWith('[ERROR]') ? 'text-red-400' : ''}`}>
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