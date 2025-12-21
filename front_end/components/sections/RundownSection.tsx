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
        <section id="rundown-section" className="container mx-auto py-10 px-4">

            {/* Main Container dengan Animasi CRT */}
            <motion.div
                animate={crtIdleAnimation}
                className="relative w-full max-w-3xl mx-auto bg-black border-4 border-gray-500 p-6 md:p-10 font-mono text-white overflow-hidden"
            >
                {/* (Opsional) Scanline Overlay untuk efek garis TV */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

                {/* Header BIOS */}
                <div className="mb-6 border-b-2 border-white/20 pb-4 relative z-20">
                    <p>NORDBYTE BIOS (C) 2025, INC.</p>
                    <p>Version 1.0.0 Beta</p>
                    <p className="mt-2">Loading System Events...</p>
                </div>

                {/* List Events */}
                <div className="flex flex-col gap-2 relative z-20">
                    {biosData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.15 }}
                            className="flex justify-between items-end border-b border-dashed border-gray-700 pb-1"
                        >
                            <div className="flex flex-col md:flex-row md:gap-4 text-sm md:text-lg">
                                <span className="text-gray-400">{item.time}</span>
                                <span className="uppercase tracking-wider">{item.task}</span>
                            </div>

                            {/* Logic Animasi: Jika status bukan "OK", maka berkedip */}
                            <motion.span
                                animate={item.status !== '[ OK ]' ? statusPulse : {}}
                                className={`${item.status === '[ OK ]' ? 'text-green-500' :
                                    item.status === '[END ]' ? 'text-red-500' : 'text-yellow-500'} font-bold`}
                            >
                                {item.status}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Status */}
                <div className="mt-8 flex justify-between text-sm text-gray-400 relative z-20">
                    <span className="animate-pulse">Press F1 to Voting</span>
                    <div className="flex">
                        <span>System Ready</span>
                        {/* Cursor Kedip Cepat */}
                        {/* Cursor Kedip Cepat */}
                        <motion.span
                            animate={{ opacity: [1, 1, 0, 0] }} // 1=Nyala, 0=Mati
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                times: [0, 0.5, 0.5, 1], // Menjaga nyala 50% waktu, mati 50% waktu (Hard Cut)
                                ease: "linear"
                            }}
                            className="w-2 h-5 bg-green-500 block ml-1"
                        ></motion.span>
                    </div>
                </div>

            </motion.div>
        </section>
    );
};

export default RundownBIOS;