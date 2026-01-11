"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

// MOCK DATA USER
const mockUser = {
    name: "Raihan Tri Rizqi",
    nim: "121140001",
    prodi: "Teknik Informatika",
};

// --- KOMPONEN BUTTON REUSABLE ---
interface RetroButtonProps {
    text: string;
    colorClass: string;
    onClick?: () => void;
    className?: string;
}

const RetroButton = ({ text, colorClass, onClick, className = "w-32 h-12" }: RetroButtonProps) => {
    return (
        <div onClick={onClick} className={`relative cursor-pointer group ${className}`}>
            <div className="absolute w-full h-full bg-black rounded-sm translate-x-1.5 translate-y-1.5"></div>
            <div className={`absolute w-full h-full ${colorClass} z-10 rounded-sm flex items-center justify-center border-4 border-black transition-transform duration-200 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-active:translate-x-1.5 group-active:translate-y-1.5`}>
                <span className="text-white font-bold font-retro text-xs md:text-sm tracking-widest">{text}</span>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const router = useRouter();

    // STATUS: 'LOCKED' | 'OPEN' | 'VOTED'
    const [status, setStatus] = useState<'LOCKED' | 'OPEN' | 'VOTED'>('LOCKED');
    const [timeLeft, setTimeLeft] = useState("");

    // --- TARGET DATE (Sesuaikan dengan jadwal asli) ---
    const TARGET_DATE = new Date("2026-01-04T09:49:00").getTime(); 

    useEffect(() => {
        const checkTime = () => {
            const now = new Date().getTime();
            const diff = TARGET_DATE - now;

            if (diff <= 0) {
                if (status === 'LOCKED') setStatus('OPEN');
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                const pad = (n: number) => String(n).padStart(2, "0");
                setTimeLeft(`${days}H ${pad(hours)}:${pad(minutes)}:${pad(seconds)} LAGI`);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 1000);
        return () => clearInterval(interval);
    }, [status, TARGET_DATE]);

    const toggleDevMode = () => {
        if (status === 'LOCKED') setStatus('OPEN');
        else if (status === 'OPEN') setStatus('VOTED');
        else setStatus('LOCKED');
    };

    const handleLogout = () => {
        router.push("/login");
    };

    const getBgColor = () => {
        if (status === 'LOCKED') return '#cbd5e1'; 
        if (status === 'VOTED') return '#92c3dd'; 
        return '#eab308'; 
    };

    return (
        <div className="min-h-screen bg-[#efe8e0] p-4 md:p-8 font-mono relative overflow-hidden text-[#000000]">

            {/* BACKGROUND DECOR */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

            {/* HEADER */}
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-10 z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#eab308] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_black]">
                        <span className="font-retro text-2xl">P</span>
                    </div>
                    <div>
                        <h1 className="font-roster text-2xl md:text-3xl leading-none">DASHBOARD</h1>
                        <p className="text-xs text-[#2b5ca6] font-bold tracking-widest font-retro">SYSTEM_V.2.0</p>
                    </div>
                </div>
                <RetroButton text="[LOGOUT]" colorClass="bg-red" onClick={handleLogout} className="w-32 h-12" />
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-start">

                {/* 1. PROFILE CARD */}
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-5 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_black] relative">
                    <div className="absolute top-0 right-0 bg-[#65a30d] text-white text-[10px] font-retro px-2 py-1 border-l-4 border-b-4 border-black">VERIFIED_USER</div>
                    <div className="flex flex-col items-center text-center mt-4">
                        <div className="w-32 h-32 bg-[#92c3dd] border-4 border-black mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_black] relative overflow-hidden group">
                            <span className="font-retro text-5xl group-hover:scale-110 transition-transform text-black">{mockUser.name.charAt(0)}</span>
                        </div>
                        <h2 className="font-roster text-2xl mb-1 uppercase">{mockUser.name}</h2>
                        <div className="inline-block bg-black text-white px-3 py-1 font-retro text-xs mb-6">ID: {mockUser.nim}</div>
                        <div className="w-full bg-[#efe8e0] border-2 border-black p-4 text-left space-y-2 text-xs font-retro">
                            <div className="flex justify-between border-b-2 border-dashed border-gray-400 pb-2">
                                <span className="text-gray-500">PRODI:</span><span className="font-bold">{mockUser.prodi.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">BATCH:</span><span className="font-bold">2021</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. STATUS CARD (ANIMATED) */}
                <motion.div
                    animate={{ backgroundColor: getBgColor() }}
                    transition={{ duration: 0.5 }}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="md:col-span-7 border-4 border-black p-8 shadow-[8px_8px_0px_0px_black] flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[400px]"
                >
                    <AnimatePresence mode="wait">

                        {/* KONDISI 1: LOCKED */}
                        {status === 'LOCKED' && (
                            <motion.div
                                key="locked"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10 w-full flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-gray-500 text-white border-4 border-black flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_black] mx-auto mb-4">
                                    <span className="font-retro">🔒</span>
                                </div>
                                <h2 className="font-roster text-3xl md:text-5xl mb-2 text-gray-700">ACCESS LOCKED</h2>
                                
                                {/* --- UPDATE TEKS DI SINI --- */}
                                <p className="font-retro text-xs text-black/60 max-w-md mx-auto mb-8 leading-relaxed">
                                    Sabar dong! biliknya aja belum di buka
                                </p>
                                
                                <div className="bg-black text-white px-6 py-3 border-4 border-gray-500 shadow-[4px_4px_0px_0px_white] font-retro text-sm animate-pulse">
                                    OPENS IN: {timeLeft || "Checking..."}
                                </div>
                            </motion.div>
                        )}

                        {/* KONDISI 2: OPEN */}
                        {status === 'OPEN' && (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="relative z-10 w-full flex flex-col items-center"
                            >
                                <motion.div 
                                    initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.5 }}
                                    className="absolute inset-0 bg-white/30 rounded-full blur-xl z-[-1]"
                                />
                                <h2 className="font-roster text-3xl md:text-5xl mb-2">READY TO VOTE?</h2>
                                <p className="font-retro text-xs text-black/80 max-w-md mx-auto mb-8 leading-relaxed">
                                    Bilik suara telah dibuka. Generate tiket voting kamu dan scan di lokasi.
                                </p>
                                <Link href="/qr_generate">
                                    <RetroButton text="[ GENERATE TICKET ]" colorClass="bg-[#e84797]" className="w-56 h-16 md:w-64 md:h-16" />
                                </Link>
                                <p className="text-[10px] font-retro mt-6 text-black/50 border-t border-black/10 pt-2 inline-block">*TIKET BERSIFAT RAHASIA</p>
                            </motion.div>
                        )}

                        {/* KONDISI 3: VOTED */}
                        {status === 'VOTED' && (
                            <motion.div
                                key="voted"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="relative z-10"
                            >
                                <div className="w-20 h-20 bg-[#65a30d] text-white border-4 border-black flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_black] mx-auto mb-4">
                                    <span className="font-retro">OK</span>
                                </div>
                                <h2 className="font-roster text-3xl md:text-4xl mb-2">SUARA TERKIRIM!</h2>
                                <p className="font-retro text-xs text-black/80 max-w-md mx-auto mb-6 leading-relaxed">
                                    Terima kasih. Data suara Anda telah dienkripsi dan disimpan.
                                </p>
                                <div className="bg-white border-2 border-black p-3 inline-block text-[10px] font-retro text-gray-500">
                                    HASH: 8x99-AB22-SECURE
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </motion.div>

            </main>

            {/* DEV BUTTON */}
            <div className="fixed bottom-4 right-4 z-50">
                <RetroButton
                    text={`DEV: ${status}`}
                    colorClass="bg-black"
                    onClick={toggleDevMode}
                    className="w-32 h-10"
                />
            </div>

        </div>
    );
}