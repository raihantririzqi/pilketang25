"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/provider/AuthProvider";
import { Home, ArrowLeft } from "lucide-react";
import api from "@/lib/axios";

const SESSION_ID = "session_pilketang_2025";

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

export default function ResultsPage() {
    const { user } = useAuth();
    const [data, setData] = useState<ResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    // Sort results by vote_count descending
    const sortedResults = data?.results
        ? [...data.results].sort((a, b) => b.vote_count - a.vote_count)
        : [];
    const winnerIndex = 0;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-mono relative overflow-hidden text-foreground">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

            {/* HEADER */}
            <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-10 z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-magenta border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_black]">
                        <span className="font-retro text-2xl text-white">R</span>
                    </div>
                    <div>
                        <h1 className="font-roster text-2xl md:text-3xl leading-none">HASIL VOTING</h1>
                        <p className="text-xs text-magenta font-bold tracking-widest font-retro">PILKETANG 2025</p>
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
                                    <span className="font-roster text-2xl">{data.total_votes}</span>
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
                                            <span className="font-roster text-4xl text-white">
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
        </div>
    );
}
