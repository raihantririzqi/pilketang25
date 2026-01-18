"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { containerVariants, popUpVariants, floatingAnimation } from "@/components/common/animation";

// --- KONFIGURASI GOOGLE ---
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
    (process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`
        : "http://localhost:3000/auth/google/callback");

const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;

export default function LoginPage() {
    return (
        <section className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden p-4">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

            {/* --- TOMBOL NAVIGASI HOME --- */}
            <Link href="/" className="absolute top-6 left-6 z-50 group">
                <div className="flex items-center gap-2 bg-navy text-white rounded-sm border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="font-retro font-bold text-sm uppercase tracking-widest">Home</span>
                </div>
            </Link>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-md"
            >
                {/* --- KARTU LOGIN --- */}
                <motion.div
                    variants={popUpVariants}
                    className="bg-white border-4 border-black rounded-3xl p-8 lg:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center relative"
                >
                    {/* Dekorasi Bintang */}
                    <motion.div animate={floatingAnimation} className="absolute -top-6 -right-6 lg:-right-8 lg:-top-8 z-20">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 border-2 border-black rotate-12 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"></div>
                    </motion.div>

                    {/* Logo */}
                    <div className="relative w-24 h-24 mb-6">
                        <Image
                            src="/images/logo_pemiket.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Judul */}
                    <h1 className="font-roster text-4xl lg:text-5xl mb-2 text-black">
                        LOGIN
                    </h1>
                    <p className="font-retro text-sm lg:text-base text-gray-600 mb-8 max-w-[80%] mx-auto leading-relaxed">
                        Masuk untuk memberikan suaramu di Pemilihan Ketua Angkatan 2025.
                    </p>

                    {/* --- TOMBOL LOGIN GOOGLE CUSTOM --- */}
                    <Link href={googleAuthUrl} className="w-full block">
                        <div className="relative w-full h-14 cursor-pointer group">
                            <div className="absolute w-full h-full bg-black rounded-sm translate-x-1.5 translate-y-1.5"></div>
                            <div className="absolute w-full h-full bg-white z-10 rounded-sm flex items-center justify-center gap-3 border-4 border-black transition-transform duration-200 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-active:translate-x-1.5 group-active:translate-y-1.5">
                                <Image
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    width={24}
                                    height={24}
                                    alt="Google"
                                />
                                <span className="font-retro font-bold text-sm md:text-lg text-black mt-1 tracking-widest">
                                    MASUK DENGAN GOOGLE
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Footer Kecil */}
                    <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300 w-full">
                        <p className="font-retro text-xs text-gray-400">
                            Pemiket &copy; 2025 - Peduli Hati
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}