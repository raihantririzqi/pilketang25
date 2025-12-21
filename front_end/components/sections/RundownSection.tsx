"use client";

import { motion } from "framer-motion";

const biosData = [
    { time: "07:30", task: "CHECKING REGISTRATION...", status: "[ OK ]" },
    { time: "08:00", task: "LOADING OPENING CEREMONY...", status: "[ OK ]" },
    { time: "09:00", task: "INITIALIZING SPEECH_MODULE...", status: "[ OK ]" },
    { time: "10:30", task: "RUNNING DEBATE_PROTOCOL...", status: "[WAIT]" },
    { time: "12:00", task: "SYSTEM COOLING DOWN (ISHOMA)...", status: "[WAIT]" },
];

const RundownBIOS = () => {
    return (
        <section id="rundown-section" className="container mx-auto py-10 px-4">
            
            <div className="w-full max-w-3xl mx-auto bg-black border-4 border-gray-500 p-6 md:p-10 shadow-[0_0_20px_rgba(0,255,0,0.2)] font-mono text-white">
                
                {/* Header BIOS */}
                <div className="mb-6 border-b-2 border-white/20 pb-4">
                    <p>NORDBYTE BIOS (C) 2025, INC.</p>
                    <p>Version 1.0.0 Beta</p>
                    <p className="mt-2">Loading System Events...</p>
                </div>

                {/* List Events */}
                <div className="flex flex-col gap-2">
                    {biosData.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.15 }}
                            className="flex justify-between items-end border-b border-dashed border-gray-700 pb-1"
                        >
                            <div className="flex flex-col md:flex-row md:gap-4">
                                <span className="text-gray-400">{item.time}</span>
                                <span className="uppercase tracking-wider">{item.task}</span>
                            </div>
                            
                            <span className={`${item.status === '[ OK ]' ? 'text-green-500' : 'text-yellow-500'} font-bold`}>
                                {item.status}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Status */}
                <div className="mt-8 flex justify-between text-sm text-gray-400 animate-pulse">
                    <span>Press F1 to Voting</span>
                    <span>System Ready_</span>
                </div>

            </div>
        </section>
    );
};

export default RundownBIOS;