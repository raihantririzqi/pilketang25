"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

const menuItems = [
  { label: "Home", target: "hero-section" },
  { label: "Kandidat", target: "kandidat-section" },
  { label: "Rundown", target: "rundown-section" },
  { label: "Feedback", target: "feedback-section" },
  { label: "FAQ", target: "faq-section" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock scroll saat mobile menu terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 z-50 w-full border-b backdrop-blur-xl backdrop-brightness-95"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero-section")}
          >
            <div className="bg-white rounded-full">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-roster text-2xl font-bold">NordByte</span>
              <span className="bg-magenta px-2 rounded text-white font-retro text-sm">
                Informatika 2025
              </span>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex gap-8 font-retro items-center">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="cursor-pointer font-bold hover:underline"
              >
                {item.label}
              </button>
            ))}

            {/* LOGIN BUTTON */}
            <div className="relative w-24 h-10 cursor-pointer group">
              <div className="absolute w-24 h-10 bg-black rounded-sm"></div>
              <div className="absolute w-24 h-10 bg-navy z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0">
                <span className="text-white font-bold text-lg">Login</span>
              </div>
            </div>
          </div>

          {/* HAMBURGER */}
          <button
            className="lg:hidden z-50 p-2"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={(id) => {
          scrollToSection(id);
          setIsMenuOpen(false);
        }}
      />
    </>
  );
};

export default Navbar;
