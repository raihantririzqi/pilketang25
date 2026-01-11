"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function LoadingPage() {
  const [progress, setProgress] = useState(10); // Mulai dari 10% biar gak kosong
  const [statusText, setStatusText] = useState("MENGHUBUNGKAN KE SERVER...");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  
  // Ref untuk mencegah double-execution di React Strict Mode
  const hasFetched = useRef(false);

  useEffect(() => {
    // 1. Validasi: Jika tidak ada code, tendang ke login
    if (!code) {
        router.replace("/login");
        return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    // --- A. LOGIK VISUAL (TIMER) ---
    // Bar akan jalan pelan-pelan mentok di 90% sambil nunggu API
    const visualTimer = setInterval(() => {
      setProgress((old) => {
        if (old >= 90) return 90; // Tahan di 90% kalau API belum kelar
        return old + Math.floor(Math.random() * 5) + 2;
      });
    }, 200);

    // --- B. LOGIK API (REAL) ---
    const processLogin = async () => {
        try {
            setStatusText("VERIFIKASI TOKEN...");
            
            // Panggil Proxy Next.js (yang sudah kita buat sebelumnya)
            const res = await axios.post("/api/auth/callback", { code });

            if (res.data.success) {
                // SUKSES!
                clearInterval(visualTimer);
                setProgress(100);
                setStatusText("BERHASIL! MENGALIHKAN...");

                // Beri jeda sedikit agar user lihat bar penuh (500ms)
                setTimeout(() => {
                    // Cek callbackUrl atau default ke dashboard
                    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
                    router.push(callbackUrl);
                    router.refresh();
                }, 800);
            }
        } catch (error) {
            console.error("Callback Error:", error);
            setStatusText("GAGAL. KEMBALI KE LOGIN...");
            setTimeout(() => {
                router.replace("/login?error=auth_failed");
            }, 1500);
        }
    };

    processLogin();

    return () => clearInterval(visualTimer);
  }, [code, router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center font-retro relative overflow-hidden">
        
        {/* Background Shapes */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-[#272643] rounded-full border-4 border-black opacity-20 animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#D6658D] rounded-full border-4 border-black opacity-20 animate-pulse"></div>

        <div className="w-full max-w-md px-6 text-center z-10 flex flex-col items-center gap-6">
            
            {/* TEXT LOADING */}
            <h2 className="font-roster text-4xl md:text-5xl text-black mb-2 uppercase">
                {progress === 100 ? "LOGIN SUKSES" : "MEMPROSES..."}
            </h2>
            
            {/* CONTAINER PROGRESS BAR */}
            <div className="w-full h-10 border-4 border-black rounded-full bg-white relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <motion.div 
                    className="h-full bg-[#2c9f45] border-r-4 border-black relative"
                    initial={{ width: "10%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                >
                    {/* Pattern Garis di dalam bar */}
                    <div className="w-full h-full bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
                </motion.div>
            </div>

            {/* PERSENTASE TEXT */}
            <div className={`font-bold text-xl px-4 py-1 rounded-lg border-2 border-black transform rotate-2 transition-colors ${progress === 100 ? 'bg-[#2c9f45] text-white' : 'bg-black text-white'}`}>
                {progress < 100 ? `${progress}%` : "SELESAI!"}
            </div>

            {/* STATUS TEXT (Dynamic) */}
            <p className="text-sm font-bold text-gray-500 mt-4 animate-pulse uppercase tracking-widest">
                {statusText}
            </p>
        </div>
    </div>
  );
}