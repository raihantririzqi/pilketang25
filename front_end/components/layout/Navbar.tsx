"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mencegah scroll saat menu terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full">
              <Image src={"/images/logo.png"} alt="Logo" width={40} height={40} />
            </div>
            <div className="flex flex-col items-start justify-center">
              <div>
                <span className="font-roster text-2xl font-bold">NordByte</span>
              </div>
              <div className="bg-magenta px-2 rounded-lg">
                <span className="text-white font-retro">Informatika 2025</span>
              </div>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-8 font-retro items-center">
            {["Home", "Kandidat", "Feedback"].map((item) => (
              <div key={item} className="cursor-pointer font-bold hover:underline">
                {item}
              </div>
            ))}
            <div className="relative w-24 h-10 cursor-pointer group">
              <div className="absolute w-24 h-10 bg-black rounded-sm"></div>
              <div className="absolute w-24 h-10 bg-navy z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0">
                <span className="text-white font-bold text-lg">Login</span>
              </div>
            </div>
          </div>

          {/* HAMBURGER BUTTON */}
          <button
            className="md:hidden z-50 p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU COMPONENT */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navbar;