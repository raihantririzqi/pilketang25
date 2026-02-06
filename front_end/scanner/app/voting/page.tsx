"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVotingStore, Candidate } from '@/store/useVotingStore';
import api from '@/lib/axios';
import CandidatCard from '@/components/ui/CandidatCard';
import { motion } from 'framer-motion';

// Mapping warna untuk Tailwind (harus explicit agar tidak di-purge)
const colorMap: Record<string, string> = {
    red: "bg-red",
    magenta: "bg-magenta",
    navy: "bg-navy",
    green: "bg-green",
    yellow: "bg-yellow",
};

// Mapping kandidat berdasarkan NIM (sesuai dengan user_app)
const candidateStyleMap: Record<string, { color: string; number: number }> = {
    "125140051": { color: "navy", number: 1 },      // MUSBAR RAMADHAN
    "125140148": { color: "green", number: 2 },  // SEYSAR RIZKY SUJADI
};

// Helper to get styling based on candidate NIM
const getCandidateStyling = (nim: string, fallbackIndex: number) => {
    if (candidateStyleMap[nim]) {
        return candidateStyleMap[nim];
    }
    // Fallback jika NIM tidak ditemukan
    const fallbackColors = ["navy", "green", "yellow"];
    return {
        color: fallbackColors[fallbackIndex % fallbackColors.length],
        number: fallbackIndex + 1
    };
};

const VotingPage = () => {
    const router = useRouter();
    const {
        votingToken,
        candidates,
        error,
        setLoading,
        setError,
        clearSession
    } = useVotingStore();

    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Protect route: if there's no token, redirect to home.
        if (!votingToken) {
            router.replace('/');
        }
    }, [votingToken, router]);

    const handleVoteClick = (candidate: Candidate) => {
        if (isSubmitting) return;
        setSelectedCandidate(candidate);
    };

    const handleConfirmVote = async () => {
        if (!selectedCandidate || !votingToken) return;

        setIsSubmitting(true);
        setLoading(true);
        setError(null);

        try {
            await api.post('/voting/submit', {
                voting_token: votingToken,
                candidate_id: selectedCandidate.id,
            });

            setShowSuccess(true);
            setTimeout(() => {
                clearSession();
                router.replace('/');
            }, 3000); // Show success message for 3 seconds

        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to submit vote. Please try again.";
            setError(errorMsg);
            // Close confirmation modal on error to let user try again
            setSelectedCandidate(null);
            setTimeout(() => {
                setError(null); // Clear error after a while
            }, 5000)
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    if (!votingToken || !candidates || candidates.length === 0) {
        // This will be shown briefly before redirection
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fdf8f4] text-black font-mono relative">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />
                <span className="relative z-10 animate-pulse">Redirecting...</span>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#2c9f45] text-white font-retro relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center relative z-10">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        {/* Tambahkan text-black atau text-[#2c9f45] agar centang terlihat */}
                        <span className="text-5xl text-black font-bold">✓</span>
                    </div>
                    <h1 className="text-5xl mb-4 font-roster">TERIMA KASIH!</h1>
                    <p className="text-xl font-mono">Suara Anda telah berhasil direkam.</p>
                    <p className="text-sm font-mono mt-8 animate-pulse bg-black/20 px-4 py-2 rounded-full inline-block">Mengarahkan kembali ke halaman utama...</p>
                </motion.div>
            </div>
        )
    }

    if (!votingToken || !candidates || candidates.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fdf8f4] text-black font-mono relative">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <span className="animate-pulse">VERIFYING_SESSION_ACCESS...</span>
                    <span className="text-[10px] text-gray-400">UNAUTHORIZED ACCESS DETECTED</span>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fdf8f4] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12 relative z-10"
            >
                <h1 className="text-5xl font-roster text-black">BILIK SUARA</h1>
                <div className="inline-block bg-magenta text-white font-retro text-sm px-4 py-1 mt-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Pilih salah satu kandidat di bawah ini
                </div>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-100 border-4 border-black text-red-700 p-4 mb-8 font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10"
                >
                    <strong>Error:</strong> {error}
                </motion.div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-10 relative z-10">
                {candidates.map((candidate, index) => {
                    const styling = getCandidateStyling(candidate.nim, index);
                    const bgClass = colorMap[styling.color] || "bg-navy";

                    return (
                        <motion.div
                            key={candidate.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <CandidatCard
                                name={candidate.name}
                                nim={candidate.nim}
                                base_color={styling.color}
                                kandidat_number={styling.number}
                                vision={candidate.vision}
                                missions={candidate.mission.split('\n').filter(m => m.trim() !== '')}
                                imageSrc={candidate.photo_url || ''}
                            />
                            <button
                                onClick={() => handleVoteClick(candidate)}
                                disabled={isSubmitting}
                                className={`w-full ${bgClass} text-white font-retro text-2xl py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform active:translate-x-2 active:translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                PILIH {candidate.name.split(' ')[0].toUpperCase()}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md p-8 text-center relative"
                    >
                        {/* Warning Icon */}
                        <div className="w-16 h-16 bg-[#ffbe0b] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span className="text-3xl">⚠️</span>
                        </div>

                        <h2 className="font-roster text-3xl mb-2">Konfirmasi Pilihan</h2>
                        <p className="font-mono text-sm mb-4 text-gray-600">Apakah Anda yakin ingin memilih:</p>
                        <p className="font-retro text-3xl text-magenta mb-2">{selectedCandidate.name}?</p>
                        <p className="font-mono text-xs text-gray-400 mb-8">Pilihan tidak dapat diubah setelah dikonfirmasi.</p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setSelectedCandidate(null)}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-white text-black font-retro border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                            >
                                BATAL
                            </button>
                            <button
                                onClick={handleConfirmVote}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-[#2c9f45] text-white font-retro border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'MENGIRIM...' : 'YA, SAYA YAKIN'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    );
};

export default VotingPage;
