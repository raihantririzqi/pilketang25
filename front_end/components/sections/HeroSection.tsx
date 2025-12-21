"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, fadeInUpVariants, floatingAnimation, popUpVariants, slowFloatingAnimation } from "../common/animation";

// --- DEFINISI ANIMASI GLOW BARU ---
// Menggabungkan efek membesar (scale) + efek cahaya (textShadow)
const textGlowAnimation = {
    scale: [1, 1.02, 1], // Tetap ada efek bernapas
    textShadow: [
        "0px 0px 0px rgba(214, 101, 141, 0)",      // Awal: Tidak ada glow
        "0px 0px 20px rgba(214, 101, 141, 0.6)",    // Tengah: Glow Magenta (sesuai warna tema)
        "0px 0px 0px rgba(214, 101, 141, 0)"       // Akhir: Kembali redup
    ],
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

const HeroSection = () => {
    // FUNGSI UNTUK SCROLL KE KANDIDAT
    const handleStartScroll = () => {
        const section = document.getElementById("kandidat-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };


    return (
        <section id="hero-section" className="flex flex-col h-screen container mx-auto py-10 items-center justify-evenly">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-14 md:gap-25"
            >
                <div className="flex flex-col items-center gap-8 md:grid md:grid-cols-2 md:gap-32">
                    
                    {/* --- LOGO BESAR --- */}
                    <motion.div
                        variants={popUpVariants}
                        className="bg-white rounded-full h-52 w-52 md:h-80 md:w-80 p-4 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
                    >
                        <motion.div
                            animate={slowFloatingAnimation}
                            className="w-full h-full"
                        >
                            <Image
                                src={"/images/logo_w_name.png"}
                                alt="Logo with Name"
                                width={300}
                                height={150}
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>

                    <div className="flex flex-col gap-8 items-center">

                        {/* --- 1. DEKORASI BINTANG & BADGE --- */}
                        <motion.div variants={popUpVariants} className="relative -rotate-6">
                            <motion.div animate={floatingAnimation}>
                                {/* Star 1 */}
                                <div className="absolute md:-translate-x-4 md:-translate-y-4 -translate-x-3 -translate-y-3 w-6 h-6 md:w-8 md:h-8 bg-blue-600 rotate-6 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"></div>
                                {/* Star 2 */}
                                <div className="absolute md:translate-x-70.5 md:translate-y-8 translate-x-54.5 translate-y-4 w-6 h-6 md:w-8 md:h-8 bg-blue-600 rotate-6 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"></div>

                                <div className="bg-magenta px-4 md:py-2 rounded-lg text-lg md:text-2xl shadow-lg">
                                    <span className="text-white font-retro">Satu Suara, Satu Angkatan!!</span>
                                </div>
                            </motion.div>
                        </motion.div>


                        {/* --- 2. TEKS JUDUL (DENGAN GLOW ANIMATION) --- */}
                        <motion.div
                            variants={fadeInUpVariants}
                            className="flex flex-col font-roster text-4xl md:text-6xl font-bold text-center leading-snug"
                        >
                            {/* GANTI 'breathingAnimation' DENGAN 'textGlowAnimation' */}
                            <motion.div animate={textGlowAnimation}> 
                                <div>Selamat</div>
                                <div>Datang Di</div>
                                {/* Hapus drop-shadow-md bawaan tailwind agar tidak tabrakan dengan glow animasi */}
                                <div className="text-magenta">Peduli Hati</div> 
                            </motion.div>
                        </motion.div>

                    </div>
                </div>

                {/* TOMBOL ACTION */}
                <motion.div
                    variants={fadeInUpVariants}
                    className="flex justify-center gap-24 md:gap-34 font-retro w-full mt-4"
                >
                    <ActionButton text="Start" color="bg-green" onClick={handleStartScroll} />
                    <ActionButton text="Voting" color="bg-navy" />
                </motion.div>
            </motion.div>
        </section>
    );
};

// ... ActionButton Component tetap sama
interface ActionButtonProps {
    text: string;
    color: string;
    onClick?: () => void;
}

const ActionButton = ({ text, color, onClick }: ActionButtonProps) => (
    <div
        className="relative w-30 h-10 md:w-60 md:h-14 cursor-pointer group"
        onClick={onClick} 
    >
        <div className="absolute w-30 h-10 md:w-60 md:h-14 bg-black rounded-sm"></div>
        <div className={`absolute w-30 h-10 md:w-60 md:h-14 ${color} z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0`}>
            <span className="text-white font-bold text-lg">{text}</span>
        </div>
    </div>
);

export default HeroSection;