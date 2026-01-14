"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// Pastikan import ini mengarah ke file CandidateCard aslimu
import CandidateCard from "@/components/ui/CandidatCard";

// --- KOMPONEN BUTTON REUSABLE (STYLE BARU) ---
interface BrutalistButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    color?: string; // Class warna background (misal: bg-white)
    textColor?: string; // Class warna text (misal: text-black)
    width?: string; // Class lebar (misal: w-full)
    height?: string; // Class tinggi (misal: h-12)
    className?: string;
}

const BrutalistButton = ({
    onClick,
    children,
    color = "bg-white",
    textColor = "text-black",
    width = "w-full",
    height = "h-14",
    className = ""
}: BrutalistButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`relative ${width} ${height} group outline-none ${className}`}
        >
            {/* Layer Bayangan (Hitam Statis) */}
            <div className="absolute w-full h-full bg-black rounded-lg"></div>

            {/* Layer Atas (Bergerak saat hover) */}
            <div className={`
                absolute w-full h-full z-10 
                -translate-x-2 -translate-y-2 
                rounded-lg border-2 border-black 
                flex items-center justify-center 
                transition-transform duration-200 
                group-hover:translate-x-0 group-hover:translate-y-0 
                group-active:translate-x-0 group-active:translate-y-0
                ${color}
            `}>
                <span className={`${textColor} font-retro text-lg md:text-xl font-bold tracking-wider`}>
                    {children}
                </span>
            </div>
        </button>
    );
};

// --- DATA DUMMY ---
const candidates = [
    {
        id: 1,
        name: "RAIHAN TRI RIZQI",
        nim: "12114001",
        base_color: "magenta",
        bg_class: "bg-magenta", // Helper untuk class tailwind
        hover_bg: "hover:bg-[#b04a6e]",
        kandidat_number: 1,
        imageSrc: "/images/kandidat1.jpg",
        vision: "Mewujudkan angkatan yang adaptif dan peduli satu sama lain.",
        missions: ["Membangun inkubator startup", "Mentoring sebaya", "Event bonding rutin"]
    },
    {
        id: 2,
        name: "CALON KANDIDAT 02",
        nim: "12114055",
        base_color: "navy",
        bg_class: "bg-navy", // Helper untuk class tailwind
        hover_bg: "hover:bg-[#000060]",
        kandidat_number: 2,
        imageSrc: "/images/kandidat2.jpg",
        vision: "Solidaritas tanpa batas, prestasi tanpa henti.",
        missions: ["Database materi terpusat", "Fundraising kreatif", "Malam keakraban"]
    }
];

export default function VotingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Ambil data dari URL
    const token = searchParams.get("token");

    const [status, setStatus] = useState<'LOADING' | 'AUTHORIZED' | 'DENIED' | 'VOTED'>('LOADING');
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    // State baru untuk hitung mundur
    const [countdown, setCountdown] = useState(5);

    // --- 1. CEK TOKEN (KEAMANAN) ---
    useEffect(() => {
        if (!token) {
            setTimeout(() => setStatus('DENIED'), 1500);
        } else {
            setTimeout(() => setStatus('AUTHORIZED'), 1500);
        }
    }, [token]);

    // --- 2. AUTO REDIRECT LOGIC ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'VOTED' && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, countdown]);

    useEffect(() => {
        if (countdown === 0 && status === 'VOTED') {
            router.push('/');
        }
    }, [countdown, status, router]);

    const handleSelect = (id: number) => {
        setSelectedCandidate(id);
        setIsConfirming(true);
    };

    const submitVote = async () => {
        // LOGIC KIRIM DATA KE BACKEND DISINI
        setTimeout(() => {
            setStatus('VOTED');
        }, 2000);
    };

    // --- TAMPILAN: LOADING ---
    if (status === 'LOADING') {
        return (
            <div className="h-screen bg-[#f4f1ea] flex flex-col items-center justify-center text-black font-retro relative">
                <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <h1 className="text-2xl animate-pulse">MEMERIKSA TOKEN...</h1>
            </div>
        );
    }

    // --- TAMPILAN: DITOLAK (ACCESS DENIED) ---
    if (status === 'DENIED') {
        return (
            <div className="h-screen bg-[#f4f1ea] flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-8xl font-roster text-black mb-2">403</h1>
                <div className="bg-red-500 text-white font-bold px-6 py-2 border-4 border-black text-xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    AKSES DITOLAK
                </div>
                <p className="font-mono text-gray-600 mb-8 max-w-md">
                    Maaf, token keamanan tidak valid atau kadaluarsa. Silakan scan ulang QR Code Anda.
                </p>

                {/* BUTTON UPDATE: HOME (DENIED) */}
                <BrutalistButton
                    onClick={() => router.push('/')}
                    width="w-64"
                    color="bg-black"
                    textColor="text-white"
                >
                    KEMBALI KE HOME
                </BrutalistButton>
            </div>
        );
    }

    // --- TAMPILAN: BERHASIL VOTE ---
    if (status === 'VOTED') {
        return (
            <div className="h-screen bg-[#f4f1ea] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce">✨</div>
                <div className="absolute bottom-1/4 right-1/4 text-4xl animate-bounce delay-75">✨</div>

                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-32 h-32 bg-green-500 border-4 border-black rounded-full flex items-center justify-center text-white text-6xl mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    ✓
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-roster mb-2 text-black">Terima Kasih!</h1>
                <p className="font-retro text-xl text-magenta mb-8">Suara Anda Telah Direkam.</p>

                <div className="bg-white border-2 border-black px-4 py-2 rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] mb-8">
                    <p className="text-sm font-mono text-gray-600">
                        Kembali otomatis dalam <span className="font-bold text-black text-lg">{countdown}</span> detik
                    </p>
                </div>

                {/* BUTTON UPDATE: HOME (VOTED) */}
                <BrutalistButton
                    onClick={() => router.push('/')}
                    width="w-56"
                    height="h-12"
                    color="bg-white"
                >
                    KEMBALI SEKARANG
                </BrutalistButton>
            </div>
        );
    }

    // --- TAMPILAN UTAMA: DASHBOARD VOTING ---
    return (
        <div className="min-h-screen bg-[#f4f1ea] text-black relative flex flex-col font-sans">

            <main className="flex-1 container mx-auto px-4 py-14 flex flex-col items-center">
                <div className="text-center mb-10 relative">
                    <motion.div
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 5 }}
                        className="absolute -top-6 -right-10 hidden md:block bg-navy text-white px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6 z-10 font-bold font-retro"
                    >
                        Peduli Hati!
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-roster text-black drop-shadow-sm mb-2">
                        Pilih Ketua Angkatan
                    </h1>
                    <p className="font-retro text-gray-600 text-lg">Gunakan hak suaramu untuk masa depan kita.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-12 lg:gap-20 items-start pb-24">
                    {candidates.map((candidate, index) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative z-10 group hover:z-20 transform transition-transform duration-300 hover:scale-[1.02]">
                                <CandidateCard {...candidate} />
                            </div>

                            {/* BUTTON UPDATE: VOTE CANDIDATE */}
                            <div className="mt-6 w-full max-w-[250px]">
                                <BrutalistButton
                                    onClick={() => handleSelect(candidate.id)}
                                    color={candidate.base_color === 'magenta' ? 'bg-magenta' : 'bg-navy'}
                                    textColor="text-white"
                                >
                                    VOTE #0{candidate.kandidat_number}
                                </BrutalistButton>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </main>

            <footer className="bg-[#f4f1ea] border-t-2 border-black py-4 text-center">
                <p className="font-mono text-xs text-gray-500">© 2025 NORDBYTE SYSTEMS // PEMILIHAN KETUA ANGKATAN</p>
            </footer>

            {/* MODAL KONFIRMASI */}
            <AnimatePresence>
                {isConfirming && selectedCandidate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#f4f1ea] border-4 border-black rounded-lg p-0 max-w-md w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                        >
                            <div className="bg-navy p-4 flex items-center justify-center border-b-4 border-black">
                                <h2 className="text-white font-roster text-2xl tracking-wide">KONFIRMASI</h2>
                            </div>

                            <div className="p-8 text-center">
                                <p className="text-gray-600 mb-2 font-bold font-retro">Anda akan memilih:</p>

                                <div className="bg-white border-2 border-black p-4 mb-6 shadow-sm inline-block rounded transform rotate-1">
                                    <p className={`text-3xl font-retro ${selectedCandidate === 1 ? 'text-magenta' : 'text-navy'}`}>
                                        KANDIDAT 0{selectedCandidate}
                                    </p>
                                </div>

                                <p className="text-xs text-gray-500 mb-8 max-w-xs mx-auto">
                                    Apakah Anda yakin? Pilihan tidak dapat diubah setelah tombol "Ya" ditekan.
                                </p>

                                <div className="flex gap-4 justify-center">

                                    {/* BUTTON UPDATE: BATAL */}
                                    <BrutalistButton
                                        onClick={() => setIsConfirming(false)}
                                        width="w-32"
                                        height="h-12"
                                        color="bg-white"
                                    >
                                        BATAL
                                    </BrutalistButton>

                                    {/* BUTTON UPDATE: YA, VOTE */}
                                    <BrutalistButton
                                        onClick={submitVote}
                                        width="w-40"
                                        height="h-12"
                                        color="bg-green-600"
                                        textColor="text-white"
                                    >
                                        YA, VOTE
                                    </BrutalistButton>

                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}