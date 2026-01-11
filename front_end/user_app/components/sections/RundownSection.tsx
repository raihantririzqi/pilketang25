"use client";

import { motion } from "framer-motion";
import { crtIdleAnimation, statusPulse } from "../common/animation";

const biosData = [
    { time: "07:30", task: "PHASE_01: PRE_ACARA (PREPARE)", status: "[ OK ]" },
    { time: "08:30", task: "PHASE_02: PEMBUKAAN_SYSTEM", status: "[ OK ]" },
    { time: "09:20", task: "PHASE_03: CALON_PENGENALAN_MODULE", status: "[LOAD]" },
    { time: "09:44", task: "PHASE_04: DEBAT_TERBUKA_PROTOCOL", status: "[RUN ]" },
    { time: "10:20", task: "PHASE_05: TANYA_JAWAB_INTERACTIVE", status: "[WAIT]" },
    { time: "12:15", task: "PHASE_06: PENUTUP_&_VOTING_CORE", status: "[WAIT]" },
    { time: "14:00", task: "PHASE_07: AFTER_ACARA (CLEANUP)", status: "[END ]" }
];

const RundownBIOS = () => {
    return (
        <section id="rundown-section" className="container mx-auto py-10 px-2 lg:px-4">
            
            <motion.div
                animate={crtIdleAnimation}
                // PERBAIKAN 1: Hapus padding di sini. Ganti border jadi border-black (Neo-Brutalist)
                className="relative w-full max-w-3xl mx-auto bg-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
                
                {/* --- BAGIAN 1: TITLE BAR (Menempel ke pinggir karena parent tidak ada padding) --- */}
                <div className="bg-[#D6658D] border-b-4 border-black p-2 flex justify-between items-center relative z-30">
                    <div className="font-bold text-white font-mono px-2 text-xs lg:text-sm truncate">
                        CMD: RUNDOWN_EXEC.exe
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-white border-2 border-black hover:bg-gray-200 cursor-pointer flex items-center justify-center font-bold text-[8px] lg:text-xs">_</div>
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-white border-2 border-black hover:bg-gray-200 cursor-pointer flex items-center justify-center font-bold text-[8px] lg:text-xs">□</div>
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-red-500 border-2 border-black hover:bg-red-400 cursor-pointer flex items-center justify-center font-bold text-[8px] lg:text-xs text-white">X</div>
                    </div>
                </div>

                {/* --- BAGIAN 2: KONTEN TERMINAL (Padding dipindah ke sini) --- */}
                <div className="p-4 lg:p-10 font-mono text-white relative">
                    
                    {/* Scanline Overlay (Hanya di area hitam) */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

                    {/* Header BIOS */}
                    <div className="mb-4 lg:mb-6 border-b border-white/20 pb-2 lg:pb-4 relative z-20 text-[10px] lg:text-base">
                        <p>NORDBYTE BIOS (C) 2025, INC.</p>
                        <p>Version 1.0.0 Beta</p>
                        <p className="mt-1 lg:mt-2">Loading System Events...</p>
                    </div>

                    {/* List Events */}
                    <div className="flex flex-col gap-3 lg:gap-2 relative z-20">
                        {biosData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.15 }}
                                className="flex flex-row justify-between items-start lg:items-end border-b border-dashed border-gray-800 pb-1"
                            >
                                <div className="flex flex-col lg:flex-row lg:gap-4 w-3/4">
                                    <span className="text-gray-500 text-[10px] lg:text-lg mb-0.5 lg:mb-0 shrink-0">
                                        {item.time}
                                    </span>
                                    <span className="text-[10px] lg:text-lg uppercase tracking-normal lg:tracking-wider leading-tight">
                                        {item.task}
                                    </span>
                                </div>

                                <motion.span
                                    animate={item.status !== '[ OK ]' ? statusPulse : {}}
                                    className={`text-[10px] lg:text-lg font-bold whitespace-nowrap ml-2 ${
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
                    <div className="mt-6 lg:mt-8 flex justify-between text-[10px] lg:text-sm text-gray-400 relative z-20">
                        <span className="animate-pulse">F1: Voting</span>
                        <div className="flex items-center">
                            <span>System Ready</span>
                            <motion.span
                                animate={{ opacity: [1, 1, 0, 0] }}
                                transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
                                className="w-1.5 h-3 lg:w-2 lg:h-5 bg-green-500 block ml-1"
                            ></motion.span>
                        </div>
                    </div>
                </div>

            </motion.div>
        </section>
    );
};

export default RundownBIOS;