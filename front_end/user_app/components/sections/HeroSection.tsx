"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, fadeInUpVariants, floatingAnimation, neonBacklight, popUpVariants, slowFloatingAnimation } from "../common/animation";
import Link from "next/link";
import { useState, useCallback } from "react";
import EasterEgg from "../ui/EasterEgg";
import TypingText from "../ui/TypingText";

// --- DEFINISI ANIMASI GLOW BARU ---
const textGlowAnimation = {
    scale: [1, 1.02, 1],
    textShadow: [
        "0px 0px 0px rgba(214, 101, 141, 0)",
        "0px 0px 20px rgba(214, 101, 141, 0.6)",
        "0px 0px 0px rgba(214, 101, 141, 0)"
    ],
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

// --- ANIMASI LOVE PULSE ---
const lovePulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

// --- ANIMASI FLOATING HEART ---
const heartFloatAnimation = {
    y: [0, -10, 0],
    rotate: [-5, 5, -5],
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

const HeroSection = () => {
    const [clickCount, setClickCount] = useState(0);
    const [showEasterEgg, setShowEasterEgg] = useState(false);

    const handleStartScroll = () => {
        const section = document.getElementById("kandidat-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Easter egg: klik logo 5x
    const handleLogoClick = useCallback(() => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (newCount >= 5) {
            setShowEasterEgg(true);
            setClickCount(0);
        }

        // Reset count setelah 2 detik jika tidak mencapai 5
        setTimeout(() => {
            setClickCount((prev) => (prev === newCount ? 0 : prev));
        }, 2000);
    }, [clickCount]);

    return (
        <section id="hero-section" className="relative flex flex-col min-h-screen container mx-auto py-10 items-center justify-center overflow-x-hidden pt-20">
            {/* overflow-x-hidden: Mencegah scroll samping jika ada animasi yang lewat batas */}

            {/* Easter Egg Component */}
            <EasterEgg trigger={showEasterEgg} onComplete={() => setShowEasterEgg(false)} />

            {/* === VALENTINE LOVE AURA DECORATIONS === */}
            {/* Floating Hearts Around Logo */}
            <motion.div
                animate={heartFloatAnimation}
                className="absolute top-32 left-10 lg:left-32 text-4xl lg:text-6xl text-pink-400/40 pointer-events-none"
            >
                ♥
            </motion.div>
            <motion.div
                animate={{
                    ...heartFloatAnimation,
                    transition: { ...heartFloatAnimation.transition, delay: 0.5 },
                }}
                className="absolute top-48 right-10 lg:right-40 text-3xl lg:text-5xl text-magenta/30 pointer-events-none"
            >
                ♥
            </motion.div>
            <motion.div
                animate={{
                    ...heartFloatAnimation,
                    transition: { ...heartFloatAnimation.transition, delay: 1 },
                }}
                className="absolute bottom-40 left-20 lg:left-48 text-2xl lg:text-4xl text-red-400/30 pointer-events-none"
            >
                ♥
            </motion.div>
            <motion.div
                animate={{
                    ...heartFloatAnimation,
                    transition: { ...heartFloatAnimation.transition, delay: 1.5 },
                }}
                className="absolute bottom-60 right-16 lg:right-56 text-3xl lg:text-5xl text-pink-500/25 pointer-events-none"
            >
                ♥
            </motion.div>

            {/* Love Glow Background Orbs */}
            <motion.div
                animate={lovePulseAnimation}
                className="absolute top-1/3 left-1/4 w-32 h-32 lg:w-64 lg:h-64 rounded-full bg-linear-to-r from-pink-400/20 to-magenta/20 blur-[60px] lg:blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{
                    ...lovePulseAnimation,
                    transition: { ...lovePulseAnimation.transition, delay: 1 },
                }}
                className="absolute bottom-1/3 right-1/4 w-40 h-40 lg:w-72 lg:h-72 rounded-full bg-linear-to-l from-red-400/15 to-pink-500/20 blur-[70px] lg:blur-[120px] pointer-events-none"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                // UPDATE 1: Gap diperkecil drastis di mobile (gap-8) vs desktop (gap-20)
                className="flex flex-col gap-8 lg:gap-20 w-full items-center"
            >
                {/* UPDATE 2: Ubah jadi Flex-Row di Desktop agar Logo di kiri & Teks di Kanan */}
                <div className="flex flex-col items-center gap-14 lg:flex-row lg:justify-center lg:gap-24 w-full">
                    {/* --- LOGO BESAR (DENGAN NEON BACKLIGHT) --- */}
                    <motion.div
                        variants={popUpVariants}
                        className="relative z-10"
                    >
                        {/* === BARU: LAYER GLOW/NEON === */}
                        {/* Ditaruh di belakang logo utama dengan posisi absolute */}
                        <motion.div
                            variants={neonBacklight}
                            animate="animate"
                            className="absolute top-0 left-0 w-full h-full rounded-full bg-magenta/60 z-0 blur-[30px] md:blur-[50px]"
                        // blur besar membuat efek pendaran cahaya lembut
                        />

                        {/* === LOGO UTAMA (DENGAN EASTER EGG) === */}
                        <motion.div
                            animate={slowFloatingAnimation}
                            onClick={handleLogoClick}
                            whileTap={{ scale: 0.95 }}
                            // Tambahkan 'relative z-10' agar berada di atas layer glow
                            className="relative z-10 bg-white rounded-full h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80 flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none"
                        >
                            <Image
                                src="/images/logo_pemiket.png"
                                alt="Logo Pemiket"
                                fill
                                className="object-contain p-6 lg:p-10 pointer-events-none"
                                sizes="(max-width: 768px) 192px, 384px"
                                priority
                            />
                            {/* Efek Kilau Stiker (Opsional) */}
                            <div className="absolute top-6 right-8 w-8 h-4 bg-white/50 rounded-full rotate-45 blur-[2px]"></div>

                            {/* Click indicator (hint) */}
                            {clickCount > 0 && clickCount < 5 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-magenta text-white text-xs font-retro px-2 py-1 rounded-full"
                                >
                                    {clickCount}/5
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>

                    <div className="flex flex-col gap-4 lg:gap-8 items-center lg:items-start">

                        {/* --- 1. DEKORASI BINTANG & BADGE --- */}
                        <motion.div variants={popUpVariants} className="relative -rotate-6">
                            <motion.div animate={floatingAnimation}>
                                {/* Star 1 (Ukuran disesuaikan) */}
                                <div className="absolute -left-2 -top-2 w-5 h-5 lg:-left-4 lg:-top-4 lg:w-8 lg:h-8 bg-blue-600 rotate-6 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"></div>
                                {/* Star 2 */}
                                <div className="absolute -right-2 -bottom-2 lg:left-1 lg:bottom-5 w-5 h-5 lg:translate-x-70.5 lg:translate-y-8 lg:w-8 lg:h-8 bg-blue-600 rotate-6 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"></div>

                                {/* Badge */}
                                <div className="bg-magenta px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-2xl shadow-lg border-2 border-black">
                                    <span className="text-white font-retro whitespace-nowrap">Satu Suara, Satu Angkatan!!</span>
                                </div>
                            </motion.div>
                        </motion.div>


                        {/* --- 2. TEKS JUDUL --- */}
                        <motion.div
                            variants={fadeInUpVariants}
                            // UPDATE 5: Font size judul diperkecil (text-4xl) di mobile
                            className="flex flex-col font-roster text-4xl sm:text-5xl lg:text-7xl font-bold text-center lg:text-left leading-tight"
                        >
                            <motion.div animate={textGlowAnimation} className="text-center">
                                <div className="text-black">Selamat</div>
                                <div className="text-black">Datang Di</div>
                                <div className="text-magenta mt-1 lg:mt-2">
                                    <TypingText
                                        text="Peduli Hati"
                                        speed={120}
                                        delay={800}
                                        showCursor={true}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>

                {/* TOMBOL ACTION */}
                <motion.div
                    variants={fadeInUpVariants}
                    // UPDATE 6: Gap antar tombol diperkecil (gap-6) agar muat berdampingan
                    className="flex justify-center gap-6 lg:gap-16 font-retro w-full mt-4 lg:mt-8"
                >
                    <ActionButton text="Start" color="bg-green" onClick={handleStartScroll} />
                    <ActionButton text="Voting" color="bg-navy" href="/login"/>
                </motion.div>
            </motion.div>
        </section>
    );
};


interface ActionButtonProps {
    text: string;
    color: string;
    onClick?: () => void;
    href?: string; // 1. Tambahkan prop opsional href
}

const ActionButton = ({ text, color, onClick, href }: ActionButtonProps) => {
    
    // 2. Definisikan tampilan visual tombol (tanpa wrapper fungsional)
    const ButtonVisual = () => (
        <div className="relative w-32 h-12 cursor-pointer group">
            {/* Layer Bayangan (Hitam) */}
            <div className="absolute w-full h-full bg-black rounded-sm"></div>

            {/* Layer Atas */}
            <div className={`absolute w-full h-full ${color} z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0`}>
                <span className="text-white font-bold font-retro text-lg">{text}</span>
            </div>
        </div>
    );

    // 3. LOGIKA RENDER:
    
    // A. Jika ada HREF, render sebagai Link (untuk navigasi)
    if (href) {
        return (
            <Link href={href}>
                <ButtonVisual />
            </Link>
        );
    }

    // B. Jika tidak ada HREF, render sebagai Button/Div biasa (untuk onClick)
    return (
        <div onClick={onClick} role="button" className="bg-transparent border-none p-0 inline-block">
            <ButtonVisual />
        </div>
    );
};

export default HeroSection;