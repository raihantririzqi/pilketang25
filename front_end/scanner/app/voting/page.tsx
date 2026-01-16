"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVotingStore, Candidate } from '@/store/useVotingStore';
import api from '@/lib/axios';
import CandidatCard from '@/components/ui/CandidatCard';
import { motion } from 'framer-motion';

// Helper to assign colors and numbers
const getCandidateStyling = (index: number) => {
    const styles = [
        { color: 'magenta', number: 1 },
        { color: 'navy', number: 2 },
        // Add more if needed
    ];
    return styles[index % styles.length];
};

const VotingPage = () => {
    const router = useRouter();
    const {
        votingToken,
        candidates,
        isLoading,
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
            console.log(candidates)
            // router.replace('/');
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
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-mono">
                Redirecting...
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-white font-retro">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <h1 className="text-5xl mb-4">TERIMA KASIH!</h1>
                    <p className="text-xl font-mono">Suara Anda telah berhasil direkam.</p>
                    <p className="text-sm font-mono mt-8 animate-pulse">Mengarahkan kembali ke halaman utama...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-roster text-black">BILIK SUARA</h1>
                <p className="font-mono text-gray-600">Pilih salah satu kandidat di bawah ini.</p>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg mb-8 font-mono shadow-lg"
                >
                    <strong>Error:</strong> {error}
                </motion.div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-10">
                {candidates.map((candidate, index) => (
                    <motion.div
                        key={candidate.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <CandidatCard
                            name={candidate.name}
                            nim={""} // NIM is not available in the voting session
                            base_color={getCandidateStyling(index).color}
                            kandidat_number={getCandidateStyling(index).number}
                            vision={candidate.vision}
                            missions={candidate.mission.split('\n').filter(m => m.trim() !== '')} // Split mission string into array
                            imageSrc={candidate.image_url || ''}
                        />
                        <button
                            onClick={() => handleVoteClick(candidate)}
                            disabled={isSubmitting}
                            className={`w-full bg-${getCandidateStyling(index).color} text-white font-retro text-2xl py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform active:translate-x-2 active:translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            PILIH {candidate.name.split(' ')[0].toUpperCase()}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md p-8 text-center"
                    >
                        <h2 className="font-roster text-3xl mb-2">Konfirmasi Pilihan Anda</h2>
                        <p className="font-mono mb-6">Apakah Anda yakin ingin memilih:</p>
                        <p className="font-retro text-4xl text-magenta mb-8">{selectedCandidate.name}?</p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setSelectedCandidate(null)}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gray-200 text-black font-retro border-4 border-black hover:bg-gray-300 transition disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmVote}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-green-500 text-white font-retro border-4 border-black hover:bg-green-600 transition disabled:opacity-50 animate-pulse"
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
