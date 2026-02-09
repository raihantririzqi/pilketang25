"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/provider/AuthProvider";
import { Home, ArrowLeft } from "lucide-react";
import api from "@/lib/axios";

const SESSION_ID = "session_pilketang_2025";

// TODO: Ganti target waktu sesuai kebutuhan
const TARGET_DATE = new Date("2026-02-10T12:00:00").getTime();

interface CandidateResult {
    candidate_id: string;
    candidate_name: string;
    vote_count: number;
    percentage: number;
}

interface ResultsData {
    session_id: string;
    is_published: boolean;
    total_votes: number;
    results: CandidateResult[];
    published_at: string | null;
}

// Warna per kandidat (urutan sesuai data)
const CANDIDATE_COLORS = ["#2b5ca6", "#65a30d", "#d946ef", "#eab308"];

// --- KOMPONEN BUTTON REUSABLE ---
const RetroButton = ({
    text,
    colorClass,
    onClick,
    className = "w-32 h-12",
    icon,
}: {
    text: string;
    colorClass: string;
    onClick?: () => void;
    className?: string;
    icon?: React.ReactNode;
}) => (
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

// --- PHASE 1: COUNTDOWN MENUJU TARGET WAKTU ---
const CountdownPhase = ({ targetDate, onComplete }: { targetDate: number; onComplete: () => void }) => {
    const [timeString, setTimeString] = useState("CALCULATING...");

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const diff = targetDate - now;
            if (diff <= 0) {
                onComplete();
                return;
            }
            const pad = (n: number) => String(n).padStart(2, "0");
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeString(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate, onComplete]);

    return (
        <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-[70vh]"
        >
            <div className="w-full max-w-md bg-white border-4 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                <div className="text-6xl mb-6">🔒</div>
                <h2 className="font-roster text-3xl md:text-4xl text-black mb-2">HASIL BELUM DIBUKA</h2>
                <p className="font-retro text-xs text-gray-500 mb-8 leading-relaxed">
                    Hasil voting akan diumumkan saat waktu yang ditentukan.
                </p>

                <div className="w-full bg-black text-white px-6 py-4 border-4 border-gray-700 rounded-lg">
                    <p className="font-retro text-[10px] text-gray-400 tracking-widest mb-2">DIBUKA DALAM</p>
                    <p className="font-mono text-4xl md:text-5xl font-bold tracking-wider animate-pulse">
                        {timeString}
                    </p>
                </div>

                <div className="mt-6 flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                        <span
                            key={i}
                            className="w-2 h-2 bg-magenta rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- PHASE 2: ANIMASI DRAMATIS 5..4..3..2..1 ---
const RevealPhase = ({ onComplete }: { onComplete: () => void }) => {
    const [count, setCount] = useState(5);
    const [showTitle, setShowTitle] = useState(false);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowTitle(true);
            const timer = setTimeout(onComplete, 1500);
            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);

    return (
        <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Dot grid overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

            {/* Scanline effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
                animate={{ y: [0, 4] }}
                transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
            />

            <AnimatePresence mode="wait">
                {count > 0 ? (
                    <motion.div
                        key={count}
                        initial={{ scale: 3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative"
                    >
                        <span className="font-roster text-[150px] md:text-[200px] text-white leading-none select-none">
                            {count}
                        </span>
                        {/* Glow ring */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0.6 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full border-2 border-magenta pointer-events-none"
                        />
                    </motion.div>
                ) : showTitle ? (
                    <motion.div
                        key="title"
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="text-center"
                    >
                        <h1 className="font-roster text-5xl md:text-7xl text-white mb-3">HASIL VOTING</h1>
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-[3px] w-12 bg-magenta" />
                            <p className="font-retro text-xs md:text-sm text-magenta tracking-[0.3em]">PEMIKET 2025</p>
                            <div className="h-[3px] w-12 bg-magenta" />
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {/* Bottom progress bar */}
            <div className="absolute bottom-12 w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-magenta"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6.5, ease: "linear" }}
                />
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE ---
export default function ResultsPage() {
    const { user } = useAuth();
    const [data, setData] = useState<ResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [phase, setPhase] = useState<"countdown" | "reveal" | "results">(
        Date.now() >= TARGET_DATE ? "reveal" : "countdown"
    );

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.get(`/sessions/${SESSION_ID}/results`);
                setData(res.data.result);
            } catch (err: any) {
                const msg =
                    err.response?.data?.message ||
                    err.response?.data?.errors?.[0] ||
                    "Gagal memuat hasil voting";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const handleCountdownComplete = useCallback(() => setPhase("reveal"), []);
    const handleRevealComplete = useCallback(() => setPhase("results"), []);

    // Sort results by vote_count descending
    const sortedResults = data?.results
        ? [...data.results].sort((a, b) => b.vote_count - a.vote_count)
        : [];
    const winnerIndex = 0;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-mono relative overflow-hidden text-foreground">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

            <AnimatePresence mode="wait">
                {/* PHASE 1: Countdown ke target waktu */}
                {phase === "countdown" && (
                    <CountdownPhase targetDate={TARGET_DATE} onComplete={handleCountdownComplete} />
                )}

                {/* PHASE 2: Animasi dramatis 5..4..3..2..1 */}
                {phase === "reveal" && (
                    <RevealPhase onComplete={handleRevealComplete} />
                )}

                {/* PHASE 3: Hasil voting */}
                {phase === "results" && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* HEADER */}
                        <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-10 z-10 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-magenta border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_black]">
                                    <span className="font-retro text-2xl text-white">R</span>
                                </div>
                                <div>
                                    <h1 className="font-roster text-2xl md:text-3xl leading-none">HASIL VOTING</h1>
                                    <p className="text-xs text-magenta font-bold tracking-widest font-retro">PEMIKET 2025</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {user && (
                                    <Link href="/dashboard">
                                        <RetroButton text="DASHBOARD" colorClass="bg-[#2b5ca6]" icon={<ArrowLeft size={16} />} className="w-36 md:w-40 h-12" />
                                    </Link>
                                )}
                                <Link href="/">
                                    <RetroButton text="HOME" colorClass="bg-black" icon={<Home size={16} />} className="w-28 md:w-32 h-12" />
                                </Link>
                            </div>
                        </header>

                        {/* CONTENT */}
                        <main className="max-w-4xl mx-auto relative z-10">
                            {loading && (
                                <div className="flex justify-center items-center min-h-[300px]">
                                    <div className="font-retro text-sm text-gray-500 animate-pulse">MEMUAT HASIL...</div>
                                </div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_black] text-center"
                                >
                                    <div className="w-20 h-20 bg-gray-200 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">🔒</span>
                                    </div>
                                    <h2 className="font-roster text-2xl mb-2">BELUM TERSEDIA</h2>
                                    <p className="font-mono text-sm text-gray-600">{error}</p>
                                </motion.div>
                            )}

                            {data && !error && (
                                <div className="space-y-6">
                                    {/* SUMMARY CARD */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_black]"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h2 className="font-roster text-xl">REKAPITULASI SUARA</h2>
                                                <p className="font-mono text-xs text-gray-500 mt-1">
                                                    {data.published_at
                                                        ? `Dipublish: ${new Date(data.published_at).toLocaleString("id-ID")}`
                                                        : "Belum dipublish"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-black">
                                                <span className="font-retro text-xs">TOTAL SUARA:</span>
                                                <span className="font-mono text-2xl font-bold">{data.total_votes}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* RESULTS CARDS */}
                                    {sortedResults.map((candidate, index) => {
                                        const color = CANDIDATE_COLORS[index % CANDIDATE_COLORS.length];
                                        const isWinner = index === winnerIndex && data.total_votes > 0;

                                        return (
                                            <motion.div
                                                key={candidate.candidate_id}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.15 }}
                                                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden"
                                            >
                                                <div className="flex flex-col sm:flex-row">
                                                    {/* RANK NUMBER */}
                                                    <div
                                                        className="w-full sm:w-24 flex items-center justify-center py-4 sm:py-0 border-b-4 sm:border-b-0 sm:border-r-4 border-black"
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        <span className="font-retro text-4xl text-white">
                                                            #{index + 1}
                                                        </span>
                                                    </div>

                                                    {/* CANDIDATE INFO */}
                                                    <div className="flex-1 p-5">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <h3 className="font-roster text-xl md:text-2xl uppercase">
                                                                {candidate.candidate_name}
                                                            </h3>
                                                            {isWinner && (
                                                                <span className="bg-yellow text-black text-[10px] font-retro px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_black]">
                                                                    TERPILIH
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* PROGRESS BAR */}
                                                        <div className="w-full bg-gray-200 border-2 border-black h-8 relative overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${candidate.percentage}%` }}
                                                                transition={{ duration: 1, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                                                                className="h-full border-r-2 border-black"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="font-retro text-xs text-black mix-blend-difference invert">
                                                                    {candidate.percentage}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* VOTE COUNT */}
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="font-mono text-xs text-gray-500">
                                                                {candidate.vote_count} suara
                                                            </span>
                                                            <span className="font-mono text-xs text-gray-400">
                                                                dari {data.total_votes} total
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
