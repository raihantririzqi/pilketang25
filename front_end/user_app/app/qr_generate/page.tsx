"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import VotingTokenCard from "@/components/ui/VotingTokenCard";
import GeneratorCard from "@/components/ui/GeneratorCard";
import api from "@/lib/axios";
import { useAuth } from "@/components/provider/AuthProvider"; // Pastikan path sesuai

// --- SUB-KOMPONEN UI ---

const WarningBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#ffbe0b] border-2 border-black p-3 mb-6 max-w-sm w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 relative z-20"
  >
    <div className="text-2xl animate-pulse">⚠️</div>
    <div className="text-left text-black">
      <h4 className="font-bold text-sm font-roster tracking-wide">JANGAN KELUAR / REFRESH!</h4>
      <p className="text-xs font-mono leading-tight mt-1">
        Tiket ini bersifat sementara. Jika Anda kembali atau reload, tiket akan <span className="underline font-bold">HILANG</span>.
      </p>
    </div>
  </motion.div>
);

const LockedDashboardCard = ({ targetDate, onComplete }: { targetDate: number; onComplete: () => void }) => {
  const [timeString, setTimeString] = useState("CALCULATING...");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff <= 0) {
        clearInterval(interval);
        onComplete();
      } else {
        const pad = (n: number) => String(n).padStart(2, "0");
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const prefix = days > 0 ? `${days}H ` : "";
        setTimeString(`${prefix}${pad(hours)}:${pad(minutes)}:${pad(seconds)} LAGI`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <motion.div className="w-full max-w-md bg-[#cbd5e1] border-4 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
      <div className="text-5xl mb-6">🔒</div>
      <h2 className="font-roster text-4xl text-black/80 mb-2">ACCESS LOCKED</h2>
      <p className="font-retro text-xs text-black/60 mb-8 leading-relaxed">Sabar dong! biliknya belum dibuka.</p>
      <div className="bg-black text-white px-6 py-3 border-4 border-gray-500 font-retro text-na animate-pulse rounded-full">
        OPENS IN: {timeString}
      </div>
    </motion.div>
  );
};

const TimeoutOverlay = ({ onRefresh }: { onRefresh: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
    <div className="bg-[#FFD23F] border-4 border-black p-6 rounded-xl text-center shadow-[6px_6px_0px_0px_black]">
      <div className="text-4xl mb-2">⌛</div>
      <h3 className="font-bold text-xl uppercase">Sesi Habis</h3>
      <p className="text-xs mb-4 font-mono">Demi keamanan, silakan ambil tiket baru.</p>
      <button onClick={onRefresh} className="bg-black text-white px-4 py-2 font-bold w-full border-2 border-black hover:bg-white hover:text-black transition-all">REFRESH TOKEN</button>
    </div>
  </motion.div>
);

const SuccessScannedView = () => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
    <div className="bg-[#2c9f45] border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-white relative">
      <div className="w-20 h-20 bg-white rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">💻</span>
      </div>
      <h2 className="font-roster text-2xl mb-2 uppercase">Tiket Terverifikasi!</h2>
      <p className="text-sm font-mono bg-black/20 p-4 rounded border border-black/10">Silakan alihkan pandangan ke <strong>Layar Laptop / Bilik Suara</strong> di depan Anda.</p>
    </div>
  </motion.div>
);

const AlreadyVotedView = () => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
    <div className="bg-[#fb8500] border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-white">
      <div className="text-5xl mb-6">✅</div>
      <h2 className="font-roster text-2xl mb-2 uppercase">Anda Sudah Memilih!</h2>
      <p className="text-sm font-mono leading-relaxed mb-6">Terima kasih atas partisipasi Anda dalam Pemiket 2026.</p>
      <Link href="/dashboard" className="text-xs underline hover:text-black">Kembali ke Dashboard</Link>
    </div>
  </motion.div>
);

// --- MAIN PAGE ---

export default function GenerateQrPage() {
  const { user, isLoading: authLoading } = useAuth(); // Ambil status auth

  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [ticketData, setTicketData] = useState<{ token: string, name: string, nim: string, profile_picture: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(30);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const TARGET_DATE = new Date(process.env.NEXT_PUBLIC_VOTING_UNLOCK || "2026-02-17T12:35:00").getTime();

  // Efek Sinkronisasi Awal
  useEffect(() => {
    setIsClient(true);
    if (new Date().getTime() >= TARGET_DATE) setIsVotingOpen(true);
    if (user?.has_voted) setAlreadyVoted(true);
  }, [user]);

  // Proteksi Reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (ticketData && !isScanned && !isTimeout) {
        e.preventDefault(); e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [ticketData, isScanned, isTimeout]);

  // Fungsi Cek Status (Polling)
  const checkStatus = useCallback(async (isFinalCheck = false) => {
    if (!ticketData || isScanned || isTimeout || isChecking) return;
    try {
      setIsChecking(true);
      const res = await api.get(`/qr/status/${ticketData.token}`);
      if (res.data.result.is_used) {
        setIsScanned(true);
      } else if (res.data.result.is_expired || isFinalCheck) {
        setIsTimeout(true);
      }
    } catch (error) {
      if (isFinalCheck) setIsTimeout(true);
    } finally {
      setIsChecking(false);
    }
  }, [ticketData?.token, isScanned, isTimeout, isChecking]);

  // Polling Interval (Tanpa dependensi timeLeft agar tidak reset)
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    if (ticketData && !isTimeout && !isScanned) {
      pollInterval = setInterval(() => checkStatus(false), 2000);
    }
    return () => { if (pollInterval) clearInterval(pollInterval); };
  }, [ticketData?.token, isTimeout, isScanned, checkStatus]);

  // Timer Countdown (synced with server expires_at)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (ticketData && expiresAt && !isTimeout && !isScanned) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          checkStatus(true);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [ticketData, expiresAt, isTimeout, isScanned, checkStatus]);

  const handleGenerateToken = async () => {
    if (user?.has_voted) { setAlreadyVoted(true); return; }

    setIsLoading(true);
    setIsTimeout(false);
    setIsScanned(false);
    setTicketData(null);
    setExpiresAt(null);

    try {
      const res = await api.post("/qr/generate");
      if (res.data.result) {
        const serverExpiresAt = new Date(res.data.result.expires_at).getTime();
        const remaining = Math.max(0, Math.ceil((serverExpiresAt - Date.now()) / 1000));
        setExpiresAt(serverExpiresAt);
        setTotalTime(remaining);
        setTimeLeft(remaining);
        setTicketData({
          token: res.data.result.token,
          name: res.data.result.user_name,
          nim: res.data.result.user_nim,
          profile_picture: res.data.result.profile_picture,
        });
      }
    } catch (error: any) {
      if (error.response?.status === 409) setAlreadyVoted(true);
      else alert("Gagal mendapatkan tiket. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = () => { setIsTimeout(false); handleGenerateToken(); };

  if (!isClient || authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center font-retro text-sm animate-pulse relative">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />
      <span className="relative z-10">MEMVERIFIKASI AKSES...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-20 px-4 flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

      {/* Back Button */}
      {(!ticketData || isScanned || isTimeout || alreadyVoted) && (
        <Link href="/dashboard" className="absolute top-8 left-8 z-50 group">
          <div className="bg-white border-2 border-black p-2 rounded shadow-[4px_4px_0px_0px_black] group-hover:translate-x-1 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
        </Link>
      )}

      <div className="text-center mb-10 z-10">
        <h1 className="font-roster text-5xl mb-3 text-black">BILIK SUARA</h1>
        <div className={`font-mono border-2 border-black inline-flex items-center gap-2 px-4 py-1 text-sm shadow-[4px_4px_0px_0px_black] rounded-full ${isVotingOpen ? 'bg-[#2c9f45] text-white' : 'bg-white text-gray-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isVotingOpen ? 'bg-white animate-pulse' : 'bg-red-500'}`} />
          {isVotingOpen ? "STATUS: OPEN" : "STATUS: LOCKED"}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isVotingOpen && (
          <LockedDashboardCard key="locked" targetDate={TARGET_DATE} onComplete={() => setIsVotingOpen(true)} />
        )}

        {isVotingOpen && (
          <motion.div key="open" className="w-full flex flex-col items-center z-10">
            {alreadyVoted ? (
              <AlreadyVotedView />
            ) : (
              <>
                {!ticketData && (
                  <GeneratorCard onClick={handleGenerateToken} isLoading={isLoading} />
                )}

                {ticketData && !isScanned && (
                  <motion.div key="qr" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm flex flex-col items-center relative">
                    {!isTimeout && <WarningBanner />}

                    <div className="w-full mb-4">
                      <div className="flex justify-between font-mono text-[10px] font-bold mb-1">
                        <span className={isTimeout ? "text-gray-400" : "text-red-500 animate-pulse"}>
                          {isChecking ? "CHECKING..." : isTimeout ? "EXPIRED" : "TIME LEFT"}
                        </span>
                        <span>{timeLeft}s</span>
                      </div>
                      <div className="h-1.5 border border-black rounded-full bg-white overflow-hidden">
                        <motion.div className="h-full bg-red-500" animate={{ width: isTimeout ? "0%" : `${(timeLeft / totalTime) * 100}%` }} transition={{ ease: "linear", duration: 0.5 }} />
                      </div>
                    </div>

                    <div className={`transition-all w-full ${isTimeout ? 'blur-md grayscale opacity-50' : ''}`}>
                      <VotingTokenCard ticket={ticketData} />
                    </div>

                    {isTimeout && <TimeoutOverlay onRefresh={handleRefreshToken} />}
                  </motion.div>
                )}

                {isScanned && <SuccessScannedView />}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}