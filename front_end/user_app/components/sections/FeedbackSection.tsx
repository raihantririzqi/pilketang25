"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FeedbackSection = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [showModal, setShowModal] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({}); // Reset error setiap kali submit

        const formData = new FormData(e.currentTarget);
        const nameInput = (formData.get("name") as string).trim();
        const emailInput = (formData.get("email") as string).trim();
        const messageInput = (formData.get("message") as string).trim();

        // --- LOGIKA VALIDASI ---
        const newErrors: { [key: string]: string } = {};

        // 1. Validasi Pesan (Wajib & Minimal 5 karakter agar tidak spam)
        if (!messageInput || messageInput.length < 5) {
            newErrors.message = "Isi aspirasi minimal 5 karakter ya!";
        }

        // 2. Validasi Nama & Email (Hanya jika TIDAK anonim)
        if (!isAnonymous) {
            if (!nameInput) {
                newErrors.name = "Nama wajib diisi kalau tidak anonim.";
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || !emailPattern.test(emailInput)) {
                newErrors.email = "Format email sepertinya salah.";
            }
        }

        // Jika ada error, hentikan proses dan tampilkan di UI
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // --- PROSES KIRIM ---
        setStatus("loading");

        const payload = {
            name: isAnonymous ? "Anonim" : nameInput,
            email: isAnonymous ? "Rahasia" : emailInput,
            message: messageInput,
        };

        try {
            // Memanggil API internal Next.js (Lebih aman untuk Token Bot)
            const response = await fetch("/api/send-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus("success");
                setShowModal(true);
                (e.target as HTMLFormElement).reset();
                setIsAnonymous(false);
            } else {
                setStatus("error");
                setShowModal(true);
            }
        } catch (error) {
            setStatus("error");
            setShowModal(true);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setTimeout(() => setStatus("idle"), 300);
    };

    return (
        <section id="feedback-section" className="relative container mx-auto py-20 px-4 flex flex-col gap-14 items-center">

            {/* Pop-up Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className={`relative max-w-sm w-full p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 text-center ${status === "success" ? "bg-[#BFFF00]" : "bg-red-500"
                                }`}
                        >
                            <div className="text-5xl mb-2">{status === "success" ? "⚡" : "❌"}</div>
                            <h3 className="font-retro text-2xl font-black uppercase italic tracking-tighter">
                                {status === "success" ? "Berhasil Terkirim!" : "Gagal Terkirim!"}
                            </h3>
                            <p className="font-mono font-bold text-sm leading-tight">
                                {status === "success"
                                    ? "Aspirasi kamu sudah masuk ke sistem kami. Terima kasih!"
                                    : "Gagal terhubung ke server. Coba lagi nanti ya!"}
                            </p>
                            <button onClick={handleClose} className="mt-4 w-full bg-black text-white py-3 font-retro font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                TUTUP
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
                <h2 className="font-roster text-3xl lg:text-5xl text-center italic font-black">
                    Send Us Feedback
                </h2>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                    {/* Input Nama & Email (Fade out jika anonim) */}
                    <div className={`flex flex-col gap-6 transition-all duration-300 ${isAnonymous ? "opacity-30 pointer-events-none grayscale" : "opacity-100"}`}>
                        <div className="flex flex-col gap-2 font-retro">
                            <label htmlFor="name" className="font-bold text-lg italic uppercase">Nama_Lengkap</label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                placeholder="Masukkan nama..."
                                className={`w-full bg-transparent border-4 p-4 font-mono focus:outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                            />
                            {errors.name && <span className="text-red-600 font-mono text-xs font-bold italic">⚠️ {errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-2 font-retro">
                            <label htmlFor="email" className="font-bold text-lg italic uppercase">Email_atau_Kelas</label>
                            <input
                                name="email"
                                type="text"
                                id="email"
                                placeholder="contoh@itera.ac.id"
                                className={`w-full bg-transparent border-4 p-4 font-mono focus:outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                            />
                            {errors.email && <span className="text-red-600 font-mono text-xs font-bold italic">⚠️ {errors.email}</span>}
                        </div>
                    </div>

                    {/* Input Pesan */}
                    <div className="flex flex-col gap-2 font-retro">
                        <label htmlFor="message" className="font-bold text-lg italic uppercase">
                            Pesan_/_Saran
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows={4}
                            placeholder="Jangan dipendam sendiri, kasih saran atau aspirasi kamu buat panitia di sini ya..."
                            className={`w-full bg-transparent border-4 p-4 font-mono focus:outline-none transition-all resize-none ${errors.message ? 'border-red-500 bg-red-50' : 'border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                        ></textarea>
                        {errors.message && <span className="text-red-600 font-mono text-xs font-bold italic">⚠️ {errors.message}</span>}
                    </div>

                    {/* Checkbox Anonim & Tombol Kirim */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-8 h-8">
                                <input
                                    type="checkbox"
                                    className="peer absolute opacity-0 cursor-pointer w-full h-full z-10"
                                    checked={isAnonymous}
                                    onChange={() => setIsAnonymous(!isAnonymous)}
                                />
                                <div className="w-full h-full bg-transparent border-4 border-black transition-all peer-checked:bg-black flex items-center justify-center">
                                    {isAnonymous && <div className="w-3 h-3 bg-[#BFFF00] rounded-full"></div>}
                                </div>
                            </div>
                            <span className="font-retro font-bold text-lg select-none">Kirim_sebagai_Anonim</span>
                        </label>

                        <button type="submit" disabled={status === "loading"} className="relative w-32 h-12 cursor-pointer group bg-transparent border-none p-0 disabled:opacity-50">
                            <div className="absolute w-full h-full bg-black rounded-sm"></div>
                            <div className="absolute w-full h-full bg-navy z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0">
                                <span className="text-white font-bold font-retro text-lg">{status === "loading" ? "..." : "Kirim"}</span>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default FeedbackSection;