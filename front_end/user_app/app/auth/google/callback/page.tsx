"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function LoadingPage() {
  const [progress, setProgress] = useState(10);
  const [statusText, setStatusText] = useState("MENGHUBUNGKAN KE SERVER...");
  const [isError, setIsError] = useState(false); // State baru untuk handle error visual

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!code) {
      router.replace("/login");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    // --- A. LOGIK VISUAL ---
    const visualTimer = setInterval(() => {
      setProgress((old) => {
        if (old >= 90 || isError) return old; // Berhenti jika error atau sudah 90%
        return old + Math.floor(Math.random() * 5) + 2;
      });
    }, 200);

    // --- B. LOGIK API ---
    const processLogin = async () => {
      try {
        setStatusText("VERIFIKASI TOKEN...");

        const res = await axios.post("/api/auth/callback", {
          code,
          // Pastikan kirim callbackUrl jika backend membutuhkannya untuk validasi redirect_uri
          callbackUrl: window.location.origin + window.location.pathname
        });

        if (res.data.success) {
          clearInterval(visualTimer);
          setProgress(100);
          setStatusText("BERHASIL! MENGALIHKAN...");
          console.log("Login Success:", res);

          // User data akan di-fetch otomatis oleh AuthProvider via /api/auth/me
          setTimeout(() => {
            const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
            router.push(callbackUrl);
            router.refresh();
          }, 800);
        }
      } catch (error: any) {
        setIsError(true);
        clearInterval(visualTimer);

        // Mengambil pesan error dari Proxy Next.js yang sudah kita perbaiki tadi
        const errorMessage = error.response?.data?.message || "Terjadi kesalahan sistem";

        console.error("Login Error:", errorMessage);
        setStatusText(`GAGAL: ${errorMessage.toUpperCase()}`);

        // Jika error 500 (Internal Server Error), biasanya masalah di Backend/OAuth
        // Berikan waktu lebih lama agar user bisa baca errornya sebelum diredirect
        setTimeout(() => {
          router.replace(`/login?error=${encodeURIComponent(errorMessage)}`);
        }, 3000);
      }
    };

    processLogin();

    return () => clearInterval(visualTimer);
  }, [code, router, searchParams, isError]); // Tambahkan isError ke dependency

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center font-retro relative overflow-hidden">

      <div className="w-full max-w-md px-6 text-center z-10 flex flex-col items-center gap-6">

        <h2 className={`font-roster text-4xl md:text-5xl mb-2 uppercase ${isError ? 'text-red-600' : 'text-black'}`}>
          {isError ? "AUTHENTICATION ERROR" : (progress === 100 ? "LOGIN SUKSES" : "MEMPROSES...")}
        </h2>

        {/* CONTAINER PROGRESS BAR */}
        <div className="w-full h-10 border-4 border-black rounded-full bg-white relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <motion.div
            className={`h-full border-r-4 border-black relative transition-colors duration-500 ${isError ? 'bg-red-500' : 'bg-[#2c9f45]'}`}
            initial={{ width: "10%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <div className="w-full h-full bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
          </motion.div>
        </div>

        {/* PERSENTASE / ERROR TAG */}
        <div className={`font-bold text-xl px-4 py-1 rounded-lg border-2 border-black transform rotate-2 transition-colors ${isError ? 'bg-red-600 text-white' : (progress === 100 ? 'bg-[#2c9f45] text-white' : 'bg-black text-white')}`}>
          {isError ? "FAILED" : (progress < 100 ? `${progress}%` : "SELESAI!")}
        </div>

        {/* STATUS TEXT */}
        <p className={`text-sm font-bold mt-4 uppercase tracking-widest ${isError ? 'text-red-500' : 'text-gray-500 animate-pulse'}`}>
          {statusText}
        </p>
      </div>
    </div>
  );
}