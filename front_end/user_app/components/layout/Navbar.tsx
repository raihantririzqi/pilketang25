"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { useAuth } from "../provider/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LayoutDashboard, LogOut, User, BarChart3 } from "lucide-react";

const menuItems = [
  { label: "Home", target: "hero-section" },
  { label: "Kandidat", target: "kandidat-section" },
  { label: "Rundown", target: "rundown-section" },
  { label: "Feedback", target: "feedback-section" },
  { label: "FAQ", target: "faq-section" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
          <div className="hidden md:flex gap-8 font-retro items-center">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="cursor-pointer font-bold hover:underline tracking-wider"
              >
                {item.label}
              </button>
            ))}

            {/* LOGIN / USER MENU DROPDOWN */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-10 cursor-pointer group font-retro w-fit">
                    {/* Bayangan Hitam */}
                    <div className="absolute inset-0 bg-black rounded-sm w-full h-full"></div>

                    {/* Kotak Utama */}
                    <div className="relative h-full px-4 bg-magenta z-10 -translate-x-1 -translate-y-1 rounded-sm flex items-center gap-3 border-4 border-black transition-all group-hover:translate-x-0 group-hover:translate-y-0 active:scale-95">
                      <User size={18} className="text-white stroke-[3px]" />
                      <span className="text-white font-bold text-sm uppercase whitespace-nowrap tracking-wider">
                        {user.name?.split(" ")[0] || "User"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-56 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-retro p-0 bg-white overflow-hidden"
                >
                  {/* Header Nama User */}
                  <DropdownMenuLabel className="bg-navy text-white p-4 text-xs uppercase tracking-[0.15em] border-b-4 border-black">
                    Hi, {user.name}
                  </DropdownMenuLabel>

                  <div className="p-2 flex flex-col gap-1">
                    {/* Dashboard Item */}
                    <Link href="/dashboard" className="w-full">
                      <DropdownMenuItem className="cursor-pointer font-bold uppercase text-xs tracking-widest py-3 px-3 border-2 border-transparent focus:bg-magenta focus:text-white focus:border-black transition-all">
                        <div className="flex items-center gap-3">
                          <LayoutDashboard size={18} />
                          <span>Dashboard</span>
                        </div>
                      </DropdownMenuItem>
                    </Link>

                    {/* Hasil Voting Item */}
                    <Link href="/results" className="w-full">
                      <DropdownMenuItem className="cursor-pointer font-bold uppercase text-xs tracking-widest py-3 px-3 border-2 border-transparent focus:bg-magenta focus:text-white focus:border-black transition-all">
                        <div className="flex items-center gap-3">
                          <BarChart3 size={18} />
                          <span>Hasil Voting</span>
                        </div>
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator className="bg-black h-1 my-1" />

                    {/* Logout Item */}
                    <DropdownMenuItem
                      onClick={async () => {
                        await logout();
                      }}
                      className="cursor-pointer font-bold uppercase text-xs tracking-widest py-3 px-3 text-red-600 focus:bg-red-500 focus:text-white border-2 border-transparent focus:border-black transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut size={18} />
                        <span>Keluar / Logout</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <div className="relative w-24 h-10 cursor-pointer group font-retro">
                  <div className="absolute w-24 h-10 bg-black rounded-sm"></div>
                  <div className="absolute w-24 h-10 bg-navy z-10 -translate-x-1.5 -translate-y-1.5 rounded-sm flex items-center justify-center border-4 border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 active:translate-x-0 active:translate-y-0">
                    <span className="text-white font-bold text-lg">Login</span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="md:hidden z-50 p-2"
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
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
      />
    </>
  );
};

interface RetroButtonProps {
  text: string;
  colorClass: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const RetroButton = ({
  text,
  colorClass,
  onClick,
  className = "w-32 h-12",
  icon,
}: RetroButtonProps) => {
  return (
    <div onClick={onClick} className={`relative cursor-pointer group ${className}`}>
      <div className="absolute w-full h-full bg-black rounded-sm translate-x-1.5 translate-y-1.5"></div>
      <div
        className={`absolute w-full h-full ${colorClass} z-10 rounded-sm flex items-center justify-center gap-2 border-4 border-black transition-transform duration-200 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-active:translate-x-1.5 group-active:translate-y-1.5`}
      >
        {icon && <span className="text-white">{icon}</span>}
        <span className="text-white font-bold font-retro text-xs md:text-sm tracking-widest uppercase">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Navbar;
