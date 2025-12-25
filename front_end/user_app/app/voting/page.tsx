"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// Pastikan import ini mengarah ke file CandidateCard aslimu
import CandidateCard from "@/components/ui/CandidatCard"; 

// --- DATA DUMMY (Sesuaikan dengan format props card kamu) ---
const candidates = [
  {
    id: 1,
    name: "RAIHAN TRI RIZQI",
    nim: "12114001",
    base_color: "magenta", // Sesuai tema Peduli Hati
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
  const voterName = searchParams.get("name");
  
  const [status, setStatus] = useState<'LOADING' | 'AUTHORIZED' | 'DENIED' | 'VOTED'>('LOADING');
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // --- 1. CEK TOKEN (KEAMANAN) ---
  useEffect(() => {
    if (!token) {
      setTimeout(() => setStatus('DENIED'), 1500);
    } else {
      setTimeout(() => setStatus('AUTHORIZED'), 1500);
    }
  }, [token]);

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
            <button 
                onClick={() => router.push('/')} 
                className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            >
                KEMBALI KE HOME
            </button>
        </div>
    );
  }

  // --- TAMPILAN: BERHASIL VOTE ---
  if (status === 'VOTED') {
    return (
        <div className="h-screen bg-[#f4f1ea] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            {/* Dekorasi Bintang */}
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
            
            <button onClick={() => router.push('/')} className="underline font-bold hover:text-navy">
                Kembali ke Halaman Utama
            </button>
        </div>
    );
  }

  // --- TAMPILAN UTAMA: DASHBOARD VOTING ---
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-black relative flex flex-col font-sans">
      

      {/* 2. HEADER JUDUL */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-10 relative">
            {/* Dekorasi Sticker */}
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

        {/* 3. GRID KARTU KANDIDAT */}
        <div className="flex flex-wrap justify-center gap-12 lg:gap-20 items-start pb-24">
            {candidates.map((candidate, index) => (
                <motion.div 
                    key={candidate.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex flex-col items-center group"
                >
                    {/* --- KARTU ASLI KAMU (Flip Card) --- */}
                    {/* Style card tetap 'alami' sesuai component aslinya */}
                    <div className="relative z-10 hover:z-20 transform transition-transform duration-300 hover:scale-[1.02]">
                        <CandidateCard {...candidate} />
                    </div>

                    {/* --- TOMBOL VOTE (Style sesuai screenshot: Bold, Shadow Keras) --- */}
                    <button
                        onClick={() => handleSelect(candidate.id)}
                        className={`
                            mt-6 relative px-10 py-3 w-full max-w-[250px]
                            border-2 border-black rounded-lg
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            transform transition-all active:translate-y-1 active:shadow-none
                            ${candidate.base_color === 'magenta' ? 'bg-magenta hover:bg-[#b04a6e]' : 'bg-navy hover:bg-[#000060]'}
                        `}
                    >
                        <span className="text-white font-retro text-xl font-bold tracking-wider">
                            VOTE #0{candidate.kandidat_number}
                        </span>
                    </button>

                </motion.div>
            ))}
        </div>
      </main>

      {/* 4. FOOTER SIMPLE */}
      <footer className="bg-[#f4f1ea] border-t-2 border-black py-4 text-center">
        <p className="font-mono text-xs text-gray-500">© 2025 NORDBYTE SYSTEMS // PEMILIHAN KETUA ANGKATAN</p>
      </footer>

      {/* 5. MODAL KONFIRMASI (Style: Peduli Hati / Creamy) */}
      <AnimatePresence>
        {isConfirming && selectedCandidate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#f4f1ea] border-4 border-black rounded-lg p-0 max-w-md w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                >
                    {/* Header Modal */}
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
                            <button 
                                onClick={() => setIsConfirming(false)}
                                className="px-6 py-2 font-bold border-2 border-black rounded hover:bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-0.5 active:shadow-none bg-white"
                            >
                                BATAL
                            </button>
                            <button 
                                onClick={submitVote}
                                className="px-6 py-2 font-bold text-white border-2 border-black rounded bg-green-600 hover:bg-green-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-0.5 active:shadow-none"
                            >
                                YA, VOTE
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}