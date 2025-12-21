"use client";

import { motion } from "framer-motion";

const FeedbackSection = () => {
  return (
    <section id="feedback-section" className="container mx-auto py-20 px-4 flex flex-col gap-14 items-center">
      
      {/* --- FORM CONTAINER --- */}
      <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
        
        {/* Judul Section */}
        <h2 className="font-roster text-3xl md:text-5xl text-center">
          Send Us Feedback
        </h2>
        
        {/* Form Box */}
        <form className="w-full flex flex-col gap-6">
            
            {/* Input Nama */}
            <div className="flex flex-col gap-2 font-retro">
                <label htmlFor="name" className="font-bold text-lg">Nama_Lengkap</label>
                <input 
                    type="text" 
                    id="name" 
                    placeholder="Masukkan nama kamu..."
                    className="w-full bg-transparent border-4 border-black p-4 font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-500"
                />
            </div>

            {/* Input Email */}
            <div className="flex flex-col gap-2 font-retro">
                <label htmlFor="email" className="font-bold text-lg">Email_atau_Kelas</label>
                <input 
                    type="text" 
                    id="email" 
                    placeholder="contoh@itera.ac.id"
                    className="w-full bg-transparent border-4 border-black p-4 font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-500"
                />
            </div>

            {/* Input Pesan */}
            <div className="flex flex-col gap-2 font-retro">
                <label htmlFor="message" className="font-bold text-lg">Pesan_/_Saran</label>
                <textarea 
                    id="message" 
                    rows={4}
                    placeholder="Tuliskan aspirasi atau saranmu..."
                    className="w-full bg-transparent border-4 border-black p-4 font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-500 resize-none"
                ></textarea>
            </div>

            {/* --- TOMBOL SUBMIT (Gaya Login Button) --- */}
            <div className="flex justify-end mt-4">
                {/* Saya ubah w-24 menjadi w-32 agar lebih lega untuk tombol 'Kirim' */}
                <button className="relative w-32 h-12 cursor-pointer group bg-transparent border-none p-0">
                    
                    {/* Layer Bayangan (Hitam) */}
                    <div className="absolute w-full h-full bg-black rounded-sm"></div>
                    
                    {/* Layer Atas (Navy) */}
                    <div className="absolute w-full h-full bg-navy z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0">
                        <span className="text-white font-bold font-retro text-lg">Kirim</span>
                    </div>

                </button>
            </div>

        </form>
      </div>

    </section>
  );
};

export default FeedbackSection;