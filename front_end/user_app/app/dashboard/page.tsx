"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/provider/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogOut, BarChart3 } from "lucide-react";
import api from "@/lib/axios";

// --- KOMPONEN BUTTON REUSABLE ---
interface RetroButtonProps {
    text: string;
    colorClass: string;
    onClick?: () => void;
    className?: string;
    icon?: React.ReactNode;
}

const RetroButton = ({
    text,
    colorClass,
    onClick,
    className = "w-32 h-12",
    icon,
}: RetroButtonProps) => {
    return (
        <div onClick={onClick} className={`relative cursor-pointer group ${className}`}>
            <div className="absolute w-full h-full bg-black rounded-sm translate-x-1.5 translate-y-1.5"></div>
            <div
                className={`absolute w-full h-full ${colorClass} z-10 rounded-sm flex items-center justify-center gap-2 border-4 border-black transition-transform duration-200 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-active:translate-x-1.5 group-active:translate-y-1.5`}
            >
                {icon && <span className="text-white">{icon}</span>}
                <span className="text-white font-bold font-retro text-xs md:text-sm tracking-widest uppercase">
                    {text}
                </span>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { user, logout } = useAuth();

    // STATUS: 'LOCKED' | 'OPEN' | 'VOTED'
    const [status, setStatus] = useState<"LOCKED" | "OPEN" | "VOTED">("LOCKED");
    const [timeLeft, setTimeLeft] = useState("");

    // COMMITTEE: publish state
    const [isPublishing, setIsPublishing] = useState(false);
    const [isAlreadyPublished, setIsAlreadyPublished] = useState(false);
    const [publishedAt, setPublishedAt] = useState<string | null>(null);
    const [publishResult, setPublishResult] = useState<{ total_votes: number; total_candidates: number } | null>(null);
    const [publishError, setPublishError] = useState("");

    const isCommittee = user?.role === "COMMITTEE";
    const SESSION_ID = "session_pilketang_2025";

    // Cek status publish saat mount (hanya untuk COMMITTEE)
    useEffect(() => {
        if (!isCommittee) return;
        const checkPublishStatus = async () => {
            try {
                const res = await api.get(`/sessions/${SESSION_ID}/results`);
                if (res.data.result?.is_published) {
                    setIsAlreadyPublished(true);
                    setPublishedAt(res.data.result.published_at);
                }
            } catch {
                // Belum di-publish atau error — abaikan
            }
        };
        checkPublishStatus();
    }, [isCommittee]);

    const handlePublish = async () => {
        if (!confirm("Yakin ingin publish hasil voting? Aksi ini tidak bisa dibatalkan.")) return;
        setIsPublishing(true);
        setPublishError("");
        try {
            const res = await api.post(`/sessions/${SESSION_ID}/publish`);
            setPublishResult(res.data.result);
            setIsAlreadyPublished(true);
            setPublishedAt(new Date().toISOString());
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || "Gagal publish hasil";
            setPublishError(msg);
        } finally {
            setIsPublishing(false);
        }
    };

    const displayUser = user || { name: "User", nim: "000000000", profile_picture: "" };

    const TARGET_DATE = new Date(process.env.NEXT_PUBLIC_VOTING_UNLOCK || "2026-02-17T12:35:00").getTime();

    useEffect(() => {
        // Prioritas 1: Jika sudah voting, langsung set VOTED
        if (user?.has_voted) {
            setStatus("VOTED");
            return;
        }

        const checkTime = () => {
            const now = new Date().getTime();
            const diff = TARGET_DATE - now;

            if (diff <= 0 || user?.role === "COMMITTEE") {
                // Waktu sudah lewat atau committee, bilik terbuka
                setStatus("OPEN");
            } else {
                // Waktu belum sampai, tetap LOCKED
                setStatus("LOCKED");
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
    }, [user, TARGET_DATE]);

    const toggleDevMode = () => {
        if (status === "LOCKED") setStatus("OPEN");
        else if (status === "OPEN") setStatus("VOTED");
        else setStatus("LOCKED");
    };

    const getBgColor = () => {
        if (status === "LOCKED") return "#cbd5e1";
        if (status === "VOTED") return "#92c3dd";
        return "#eab308";
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-mono relative overflow-hidden text-foreground">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

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

                <div className="flex gap-4">
                    <Link href="/">
                        <RetroButton text="HOME" colorClass="bg-[#2b5ca6]" icon={<Home size={16} />} className="w-28 md:w-32 h-12" />
                    </Link>
                    <RetroButton text="[LOGOUT]" colorClass="bg-red" onClick={async () => await logout()} className="w-32 h-12" />
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-start">

                {/* 1. PROFILE CARD (KEMBALI KE ORIGINAL) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-5 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_black] relative"
                >
                    <div className="absolute top-0 right-0 bg-[#65a30d] text-white text-[10px] font-retro px-2 py-1 border-l-4 border-b-4 border-black">
                        VERIFIED_USER
                    </div>
                    <div className="flex flex-col items-center text-center mt-4">
                        <div className="w-32 h-32 mb-4 relative group">
                            <div className="absolute inset-0 bg-black translate-x-1 translate-y-1"></div>
                            <Avatar className="w-32 h-32 rounded-none border-4 border-black bg-[#92c3dd] relative z-10 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                                <AvatarImage src={displayUser.profile_picture || ""} alt={displayUser.name} className="object-cover group-hover:scale-110 transition-transform duration-300" />
                                <AvatarFallback className="rounded-none bg-[#92c3dd] font-retro text-5xl text-black uppercase">
                                    {displayUser.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <h2 className="font-roster text-2xl mb-1 uppercase">{displayUser.name}</h2>
                        <div className="inline-block bg-black text-white px-3 py-1 font-retro text-xs mb-6">NIM: {displayUser.nim}</div>
                        <div className="w-full bg-background border-2 border-black p-4 text-left space-y-2 text-xs font-retro">
                            <div className="flex justify-between border-b-2 border-dashed border-gray-400 pb-2">
                                <span className="text-gray-500">PRODI:</span><span className="font-bold">TEKNIK INFORMATIKA</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">BATCH:</span><span className="font-bold">2025</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. STATUS CARD */}
                <motion.div
                    animate={{ backgroundColor: getBgColor() }}
                    transition={{ duration: 0.5 }}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="md:col-span-7 border-4 border-black p-8 shadow-[8px_8px_0px_0px_black] flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[400px]"
                >
                    <AnimatePresence mode="wait">
                        {/* ========== LOCKED STATE ========== */}
                        {status === "LOCKED" && (
                            <motion.div
                                key="locked"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10 w-full flex flex-col items-center"
                            >
                                {/* Icon dengan animasi pulse */}
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-24 h-24 bg-gray-600 border-4 border-black rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_black] mb-6"
                                >
                                    <span className="text-5xl">🔒</span>
                                </motion.div>

                                <h2 className="font-roster text-3xl md:text-5xl mb-3 text-gray-700">BELUM WAKTUNYA</h2>

                                <p className="font-retro text-xs text-black/60 max-w-xs mx-auto mb-8 leading-relaxed bg-white/50 px-4 py-2 border-2 border-dashed border-gray-400">
                                    Ditunggu ya! Bilik suara akan segera dibuka sesuai jadwal.
                                </p>

                                {/* Timer Box */}
                                <div className="bg-black border-4 border-gray-600 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] p-1">
                                    <div className="bg-gray-900 px-6 py-4 border-2 border-gray-700">
                                        <p className="text-gray-400 text-[10px] font-mono mb-1 tracking-widest">COUNTDOWN</p>
                                        <p className="text-white font-retro text-lg md:text-xl tracking-wider animate-pulse">
                                            {timeLeft || "CALCULATING..."}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative dots */}
                                <div className="flex gap-2 mt-6">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                                </div>
                            </motion.div>
                        )}

                        {/* ========== OPEN STATE ========== */}
                        {status === "OPEN" && (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative z-10 w-full flex flex-col items-center"
                            >
                                {/* Animated Icon */}
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                    className="w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_black] mb-6"
                                >
                                    <span className="text-5xl">🗳️</span>
                                </motion.div>

                                <h2 className="font-roster text-3xl md:text-5xl mb-2">READY TO VOTE?</h2>

                                {/* Status Badge */}
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="font-mono text-xs text-black/70 uppercase tracking-widest">Bilik Suara Terbuka</span>
                                </div>

                                <p className="font-retro text-xs text-black/80 max-w-xs mx-auto mb-8 leading-relaxed">
                                    Generate tiket voting kamu dan scan di lokasi pemilihan.
                                </p>

                                {/* CTA Button dengan glow effect */}
                                <Link href="/qr_generate">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative"
                                    >
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-magenta/30 blur-xl rounded-lg"></div>
                                        <RetroButton text="GENERATE TICKET" colorClass="bg-magenta" className="w-56 h-14 md:w-64 md:h-16 relative" />
                                    </motion.div>
                                </Link>

                                {/* Warning text */}
                                <div className="flex items-center gap-2 mt-6 text-[10px] font-retro text-black/50">
                                    <span>🔐</span>
                                    <span>TIKET BERSIFAT RAHASIA & SEKALI PAKAI</span>
                                </div>
                            </motion.div>
                        )}

                        {/* ========== VOTED STATE ========== */}
                        {status === "VOTED" && (
                            <motion.div
                                key="voted"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative z-10 w-full flex flex-col items-center"
                            >
                                {/* Success Icon dengan checkmark */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-28 h-28 bg-green border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_black] mb-6 relative"
                                >
                                    <span className="text-white text-5xl font-bold">✓</span>
                                    {/* Sparkle effects */}
                                    <motion.span
                                        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                        className="absolute -top-2 -right-2 text-2xl"
                                    >✨</motion.span>
                                </motion.div>

                                <h2 className="font-roster text-3xl md:text-4xl mb-2 text-black">SUARA TERKIRIM!</h2>

                                <p className="font-retro text-xs text-black/80 max-w-xs mx-auto mb-6 leading-relaxed">
                                    Terima kasih atas partisipasi Anda dalam Pemilihan Ketua Angkatan 2025.
                                </p>

                                {/* Status Badge */}
                                <div className="flex items-center gap-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] px-6 py-3">
                                    <span className="w-3 h-3 bg-green rounded-full"></span>
                                    <span className="font-mono text-sm font-bold text-black">TERVERIFIKASI</span>
                                </div>

                                <p className="text-[10px] font-retro text-black/50 mt-6">
                                    Suara Anda telah tersimpan dengan aman
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>

            {/* COMMITTEE PANEL */}
            {isCommittee && (
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto mt-6 relative z-10"
                >
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_black]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-magenta border-2 border-black flex items-center justify-center">
                                <BarChart3 size={16} className="text-white" />
                            </div>
                            <h3 className="font-roster text-xl">COMMITTEE PANEL</h3>
                            <span className="bg-magenta text-white text-[10px] font-retro px-2 py-0.5 border-2 border-black">
                                RESTRICTED
                            </span>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-300 pt-4 space-y-4">
                            {/* STATUS: Sudah di-publish */}
                            {isAlreadyPublished && (
                                <div className="flex items-center gap-3 bg-green/10 border-2 border-green p-3">
                                    <span className="w-3 h-3 bg-green rounded-full"></span>
                                    <div className="font-mono text-sm">
                                        <span className="font-bold text-green">SUDAH DI-PUBLISH</span>
                                        {publishedAt && (
                                            <span className="text-gray-500 ml-2 text-xs">
                                                — {new Date(publishedAt).toLocaleString("id-ID")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-mono text-sm text-gray-700">
                                        {isAlreadyPublished
                                            ? "Hasil voting sudah dapat dilihat oleh semua participant."
                                            : "Publish hasil voting agar dapat dilihat oleh semua participant."}
                                    </p>
                                    <p className="font-mono text-[10px] text-gray-400 mt-1">
                                        SESSION: {SESSION_ID}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link href="/results">
                                        <RetroButton text="LIHAT HASIL" colorClass="bg-[#2b5ca6]" icon={<BarChart3 size={14} />} className="w-40 h-12" />
                                    </Link>
                                    {!isAlreadyPublished && (
                                        <RetroButton
                                            text={isPublishing ? "PUBLISHING..." : "PUBLISH"}
                                            colorClass="bg-magenta"
                                            onClick={handlePublish}
                                            className="w-36 h-12"
                                        />
                                    )}
                                </div>
                            </div>

                            {publishResult && (
                                <div className="bg-green/10 border-2 border-green p-3 font-mono text-sm">
                                    Berhasil di-publish! Total suara: <strong>{publishResult.total_votes}</strong> dari <strong>{publishResult.total_candidates}</strong> kandidat.
                                </div>
                            )}

                            {publishError && (
                                <div className="bg-red/10 border-2 border-red p-3 font-mono text-sm text-red">
                                    {publishError}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>
            )}
        </div>
    );
}