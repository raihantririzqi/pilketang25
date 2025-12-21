"use client";

import { motion } from "framer-motion";
import { crtIdleAnimation, statusPulse } from "../common/animation";

const biosData = [
    {
        time: "07:30",
        task: "PHASE_01: PRE_ACARA (PREPARE)",
        status: "[ OK ]"
    },
    {
        time: "08:30",
        task: "PHASE_02: PEMBUKAAN_SYSTEM",
        status: "[ OK ]"
    },
    {
        time: "09:20",
        task: "PHASE_03: CALON_PENGENALAN_MODULE",
        status: "[LOAD]"
    },
    {
        time: "09:44",
        task: "PHASE_04: DEBAT_TERBUKA_PROTOCOL",
        status: "[RUN ]"
    },
    {
        time: "10:20",
        task: "PHASE_05: TANYA_JAWAB_INTERACTIVE",
        status: "[WAIT]"
    },
    {
        time: "12:15",
        task: "PHASE_06: PENUTUP_&_VOTING_CORE",
        status: "[WAIT]"
    },
    {
        time: "14:00",
        task: "PHASE_07: AFTER_ACARA (CLEANUP)",
        status: "[END ]"
    }
];

// --- VARIAN ANIMASI ---

const RundownBIOS = () => {
    return (
        <section id="rundown-section" className="container mx-auto py-10 px-2 md:px-4"> {/* Padding section dikurangi di mobile */}
            
            <motion.div 
                animate={crtIdleAnimation}
                // PERUBAHAN 1: Padding container dikurangi drastis di mobile (p-4) vs desktop (p-10)
                className="relative w-full max-w-3xl mx-auto bg-black border-2 md:border-4 border-gray-500 p-4 md:p-10 font-mono text-white overflow-hidden shadow-lg"
            >
                {/* Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

                {/* Header BIOS */}
                {/* PERUBAHAN 2: Ukuran font header diperkecil (text-xs) */}
                <div className="mb-4 md:mb-6 border-b border-white/20 pb-2 md:pb-4 relative z-20 text-[10px] md:text-base">
                    <p>NORDBYTE BIOS (C) 2025, INC.</p>
                    <p>Version 1.0.0 Beta</p>
                    <p className="mt-1 md:mt-2">Loading System Events...</p>
                </div>

                {/* List Events */}
                <div className="flex flex-col gap-3 md:gap-2 relative z-20">
                    {biosData.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.15 }}
                            // PERUBAHAN 3: Layout flex disesuaikan agar tidak tabrakan
                            className="flex flex-row justify-between items-start md:items-end border-b border-dashed border-gray-800 pb-1"
                        >
                            <div className="flex flex-col md:flex-row md:gap-4 w-3/4">
                                {/* Waktu: Warna abu-abu, ukuran kecil */}
                                <span className="text-gray-500 text-[10px] md:text-lg mb-0.5 md:mb-0">
                                    {item.time}
                                </span>
                                
                                {/* Task: Ukuran responsif, tracking dikurangi di mobile agar muat */}
                                <span className="text-[10px] md:text-lg uppercase tracking-normal md:tracking-wider leading-tight">
                                    {item.task}
                                </span>
                            </div>
                            
                            {/* Status: Ukuran disesuaikan, alignment dijaga */}
                            <motion.span 
                                animate={item.status !== '[ OK ]' ? statusPulse : {}}
                                className={`text-[10px] md:text-lg font-bold whitespace-nowrap ml-2 ${
                                    item.status === '[ OK ]' ? 'text-green-500' : 
                                    item.status === '[END ]' ? 'text-red-500' : 'text-yellow-500'
                                }`}
                            >
                                {item.status}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Status */}
                <div className="mt-6 md:mt-8 flex justify-between text-[10px] md:text-sm text-gray-400 relative z-20">
                    <span className="animate-pulse">F1: Voting</span> {/* Teks dipersingkat utk mobile */}
                    <div className="flex items-center">
                        <span>System Ready</span>
                        {/* Cursor */}
                        <motion.span 
                            animate={{ opacity: [1, 1, 0, 0] }}
                            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
                            className="w-1.5 h-3 md:w-2 md:h-5 bg-green-500 block ml-1"
                        ></motion.span>
                    </div>
                </div>

            </motion.div>
        </section>
    );
};

export default RundownBIOS;