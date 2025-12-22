"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, fadeInUpVariants, floatingAnimation, popUpVariants, slowFloatingAnimation } from "../common/animation";

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

const HeroSection = () => {
    const handleStartScroll = () => {
        const section = document.getElementById("kandidat-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="hero-section" className="flex flex-col min-h-screen container mx-auto py-10 items-center justify-center overflow-x-hidden pt-20">
            {/* overflow-x-hidden: Mencegah scroll samping jika ada animasi yang lewat batas */}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                // UPDATE 1: Gap diperkecil drastis di mobile (gap-8) vs desktop (gap-20)
                className="flex flex-col gap-8 lg:gap-20 w-full items-center"
            >
                {/* UPDATE 2: Ubah jadi Flex-Row di Desktop agar Logo di kiri & Teks di Kanan */}
                <div className="flex flex-col items-center gap-14 lg:flex-row lg:justify-center lg:gap-24 w-full">

                    {/* --- LOGO BESAR --- */}
                    <motion.div
                        variants={popUpVariants}
                        className="relative z-10"
                    >
                        <motion.div
                            animate={slowFloatingAnimation}
                            // UPDATE 3: Ukuran Logo Mobile diperkecil (h-48 w-48) agar tidak menuhin layar
                            className="relative bg-white rounded-full h-48 w-48 sm:h-64 sm:w-64 lg:h-96 lg:w-96 flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Image
                                src="/images/logo_pemiket.png"
                                alt="Logo Pemiket"
                                fill
                                // Padding dikurangi di mobile agar logo tetap terlihat besar di dalam lingkaran yang kecil
                                className="object-contain p-6 lg:p-10"
                                sizes="(max-width: 768px) 192px, 384px"
                                priority
                            />
                            {/* Efek Kilau */}
                            <div className="absolute top-6 right-8 w-8 h-4 bg-white/50 rounded-full rotate-45 blur-[2px]"></div>
                        </motion.div>
                    </motion.div>

                    <div className="flex flex-col gap-4 lg:gap-8 items-center lg:items-start">

                        {/* --- 1. DEKORASI BINTANG & BADGE --- */}
                        <motion.div variants={popUpVariants} className="relative -rotate-6">
                            <motion.div animate={floatingAnimation}>
                                {/* Star 1 (Ukuran disesuaikan) */}
                                <div className="absolute -left-2 -top-2 w-5 h-5 lg:-left-4 lg:-top-4 lg:w-8 lg:h-8 bg-blue-600 rotate-6 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"></div>
                                {/* Star 2 */}
                                <div className="absolute -right-2 -bottom-2 lg:left-1 lg:-top-1 w-5 h-5 lg:translate-x-70.5 lg:translate-y-8 lg:w-8 lg:h-8 bg-blue-600 rotate-6 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"></div>

                                {/* UPDATE 4: Font size badge diperkecil (text-sm) agar tidak kepotong di HP kecil */}
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
                            <motion.div animate={textGlowAnimation}>
                                <div className="text-black">Selamat</div>
                                <div className="text-black">Datang Di</div>
                                <div className="text-magenta mt-1 lg:mt-2">Peduli Hati</div>
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
                    <ActionButton text="Voting" color="bg-navy" />
                </motion.div>
            </motion.div>
        </section>
    );
};

// Update Component ActionButton agar ukuran responsive
interface ActionButtonProps {
    text: string;
    color: string;
    onClick?: () => void;
}

const ActionButton = ({ text, color, onClick }: ActionButtonProps) => (
    // UPDATE 7: Ukuran tombol mobile diperkecil (w-32 h-12)
    <button className="relative w-32 h-12 cursor-pointer group bg-transparent border-none p-0" onClick={onClick}>

        {/* Layer Bayangan (Hitam) */}
        <div className="absolute w-full h-full bg-black rounded-sm"></div>

        {/* Layer Atas (Navy) */}
        <div className={`absolute w-full h-full ${color} z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0`}>
            <span className="text-white font-bold font-retro text-lg">{text}</span>
        </div>

    </button>
);


export default HeroSection;