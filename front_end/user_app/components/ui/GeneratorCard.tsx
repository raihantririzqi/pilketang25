"use client";

import { motion } from "framer-motion";

interface GeneratorCardProps {
    onClick: () => void;
    isLoading: boolean;
}

const GeneratorCard = ({ onClick, isLoading }: GeneratorCardProps) => {
    return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
        >
            <div className="bg-[#FFD23F] border-4 border-black rounded-xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden group">
                
                {/* Hiasan Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]"></div>

                {/* Header */}
                <div className="relative z-10 mb-6">
                    <div className="inline-block bg-black text-white px-3 py-1 font-retro text-xs font-bold -rotate-2 mb-2 border border-white">
                        LANGKAH 1
                    </div>
                    <h2 className="font-roster text-4xl text-black leading-none">
                        TIKET VOTING
                    </h2>
                </div>

                <p className="font-retro text-xs md:text-sm mb-8 relative z-10 font-bold text-black/70">
                    Klik tombol di bawah untuk mengambil token unik kamu dari server bilik suara.
                </p>

                {/* --- TOMBOL RETRO LAYERED --- */}
                <div 
                    onClick={!isLoading ? onClick : undefined}
                    className={`relative w-full h-16 cursor-pointer group mt-2 ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
                >
                    {/* Layer Bayangan (Hitam) - Tetap Diam */}
                    <div className="absolute w-full h-full bg-black rounded-lg"></div>

                    {/* Layer Atas (Putih) - Bergerak saat hover */}
                    <div className={`
                        absolute w-full h-full bg-white z-10 
                        -translate-x-1.5 -translate-y-1.5 
                        rounded-lg flex items-center justify-center gap-3
                        border-4 border-black 
                        transition-transform duration-150 ease-out
                        group-hover:translate-x-0 group-hover:translate-y-0 
                        group-active:translate-x-0 group-active:translate-y-0
                    `}>
                        {isLoading ? (
                            <>
                                 {/* Spinner */}
                                 <div className="w-5 h-5 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
                                 <span className="font-retro text-lg text-black">GENERATING...</span>
                            </>
                        ) : (
                            <>
                                <span className="font-retro text-lg md:text-xl text-black font-bold tracking-wider">GENERATE TICKET</span>
                                <span className="text-xl">🎫</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Disclaimer Kecil */}
                <p className="text-[10px] mt-6 font-mono text-black/60 relative z-10 border-t border-black/10 pt-2">
                    *Token bersifat rahasia dan hanya berlaku satu kali.
                </p>
            </div>
        </motion.div>
    );
};

export default GeneratorCard;