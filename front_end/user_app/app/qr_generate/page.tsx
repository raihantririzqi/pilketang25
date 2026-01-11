"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // <--- 1. IMPORT LINK
// import api from "@/lib/axios"; 

// --- IMPORTS UI ---
import VotingTokenCard from "@/components/ui/VotingTokenCard";
import GeneratorCard from "@/components/ui/GeneratorCard";

// --- 1. KOMPONEN LOCKED STYLE DASHBOARD ---
const LockedDashboardCard = ({ targetDate, onComplete }: { targetDate: number, onComplete: () => void }) => {
  const [timeString, setTimeString] = useState("CALCULATING...");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        onComplete();
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (n: number) => String(n).padStart(2, "0");
        setTimeString(`${days}H ${pad(hours)}:${pad(minutes)}:${pad(seconds)} LAGI`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md bg-[#cbd5e1] border-4 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center"
    >
      <div className="w-24 h-24 bg-gray-500 text-white border-4 border-black flex items-center justify-center text-5xl shadow-[4px_4px_0px_0px_black] mb-6">
        <span className="font-retro">🔒</span>
      </div>
      <h2 className="font-roster text-4xl text-black/80 mb-2">ACCESS LOCKED</h2>
      <p className="font-retro text-xs text-black/60 mb-8 max-w-[80%] leading-relaxed">
        Sabar dong! biliknya aja belum di buka. Tunggu bentar lagi ya.
      </p>
      <div className="bg-black text-white px-6 py-3 border-4 border-gray-500 shadow-[4px_4px_0px_0px_white] font-retro text-sm animate-pulse rounded-full">
        OPENS IN: {timeString}
      </div>
    </motion.div>
  );
};

// --- 2. TIMEOUT OVERLAY ---
const TimeoutOverlay = ({ onRefresh }: { onRefresh: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
    <div className="bg-[#FFD23F] border-4 border-black p-6 rounded-xl text-center shadow-[6px_6px_0px_0px_black]">
      <div className="text-4xl mb-2">⌛</div>
      <h3 className="font-bold text-xl">SESI HABIS</h3>
      <p className="text-xs mb-4">Demi keamanan, silakan ambil token baru.</p>
      <button onClick={onRefresh} className="bg-black text-white px-4 py-2 font-bold w-full hover:bg-white hover:text-black border-2 border-transparent hover:border-black transition-all">REFRESH TOKEN</button>
    </div>
  </motion.div>
);

// --- 3. SUCCESS VIEW ---
const SuccessScannedView = () => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
    <div className="bg-[#2c9f45] border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
      <div className="w-20 h-20 bg-white rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-lg">
        <span className="text-4xl">💻</span>
      </div>
      <h2 className="font-roster text-2xl md:text-3xl mb-2">TIKET TERVERIFIKASI!</h2>
      <div className="bg-black/20 p-4 rounded-lg border-2 border-black/10 text-sm font-mono mb-6">
        <p className="font-bold mb-2">LANGKAH SELANJUTNYA:</p>
        <p className="leading-relaxed">Silakan alihkan pandangan ke <strong>Layar Laptop / Bilik Suara</strong> di depan Anda.</p>
      </div>
      <button onClick={() => window.location.reload()} className="mt-6 text-xs underline hover:text-black transition-colors">Generate Tiket Baru (Jika Error)</button>
    </div>
  </motion.div>
);

// --- MAIN PAGE ---
export default function GenerateQrPage() {
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [ticketData, setTicketData] = useState<{ token: string, name: string, nim: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // LOGIC STATES
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // --- TARGET DATE ---
  const TARGET_DATE = new Date("2026-01-04T09:46:00").getTime();

  useEffect(() => {
    setIsClient(true);
    if (new Date().getTime() >= TARGET_DATE) {
      setIsVotingOpen(true);
    }
  }, []);

  // --- CEK STATUS API ---
  const checkStatus = useCallback(async (isFinalCheck = false) => {
    if (!ticketData) return;
    try {
      setIsChecking(true);
      const mockIsScanned = false;
      if (mockIsScanned) {
        setIsScanned(true);
      } else if (isFinalCheck) {
        setIsTimeout(true);
      }
    } catch (error) {
      if (isFinalCheck) setIsTimeout(true);
    } finally {
      setIsChecking(false);
    }
  }, [ticketData]);

  // --- LOGIC TIMER ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (ticketData && !isTimeout && !isScanned && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && !isTimeout && !isScanned) {
      checkStatus(true);
    }
    return () => clearInterval(timer);
  }, [ticketData, isTimeout, isScanned, timeLeft, checkStatus]);

  // --- LOGIC POLLING ---
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    if (ticketData && !isTimeout && !isScanned && timeLeft > 0) {
      pollInterval = setInterval(() => checkStatus(false), 2000);
    }
    return () => clearInterval(pollInterval);
  }, [ticketData, isTimeout, isScanned, timeLeft, checkStatus]);

  // HANDLERS
  const handleRefreshToken = () => { setIsTimeout(false); handleGenerateToken(); };
  const handleGenerateToken = async () => {
    setIsLoading(true); setIsTimeout(false); setIsScanned(false); setTimeLeft(30);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTicketData({ token: `VOTE-${Math.random()}`, name: "Raihan", nim: "12114" });
    } finally { setIsLoading(false); }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#fdf8f4] py-20 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      {/* --- 2. TOMBOL KEMBALI KE DASHBOARD --- */}
      <Link href="/dashboard" className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white border-2 border-black px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="text-xl">⬅️</span>
          <span className="font-retro text-xs font-bold hidden md:inline text-black">DASHBOARD</span>
        </motion.div>
      </Link>

      {/* Header */}
      <div className="text-center mb-10 z-10 pt-10 md:pt-0"> {/* Tambah pt-10 agar tidak nabrak tombol di mobile */}
        <h1 className="font-roster text-4xl md:text-5xl mb-3 text-black">BILIK SUARA</h1>
        <div className={`font-mono border-2 border-black inline-flex items-center gap-2 px-4 py-1 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors duration-500 rounded-full ${isVotingOpen ? 'bg-[#2c9f45] text-white' : 'bg-white text-gray-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isVotingOpen ? 'bg-white animate-pulse' : 'bg-red-500'}`}></div>
          {isVotingOpen ? "STATUS: OPEN" : "STATUS: LOCKED"}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* VIEW: LOCKED */}
        {!isVotingOpen && (
          <LockedDashboardCard key="locked" targetDate={TARGET_DATE} onComplete={() => setIsVotingOpen(true)} />
        )}

        {/* VIEW: OPEN */}
        {isVotingOpen && (
          <motion.div key="open" className="w-full flex flex-col items-center z-10">

            {/* 1. Generate */}
            {!ticketData && (
              <GeneratorCard onClick={handleGenerateToken} isLoading={isLoading} />
            )}

            {/* 2. QR Code */}
            {ticketData && !isScanned && (
              <motion.div key="qr" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm relative">
                <div className="mb-4">
                  <div className="flex justify-between font-mono text-xs font-bold mb-1">
                    <span className={isTimeout ? "text-gray-400" : "text-red-500 animate-pulse"}>
                      {timeLeft === 0 && isChecking ? "FINAL CHECKING..." : isTimeout ? "SESI HABIS" : "AUTO REFRESH"}
                    </span>
                    <span>{timeLeft}s</span>
                  </div>
                  <div className="h-2 border border-black rounded-full bg-white overflow-hidden">
                    <motion.div className="h-full bg-red-500" animate={{ width: isTimeout ? "0%" : `${(timeLeft / 30) * 100}%` }} transition={{ ease: "linear", duration: 0.5 }} />
                  </div>
                </div>

                <div className={`transition-all ${isTimeout ? 'blur-sm grayscale opacity-50' : ''}`}>
                  <VotingTokenCard tokenString={ticketData.token} userName={ticketData.name} userNIM={ticketData.nim} />
                </div>

                {isTimeout && <TimeoutOverlay onRefresh={handleRefreshToken} />}
              </motion.div>
            )}

            {/* 3. Success */}
            {isScanned && <SuccessScannedView />}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}