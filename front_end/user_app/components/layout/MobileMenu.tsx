"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LayoutDashboard, LogOut } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
  // Tambahkan props ini agar sinkron dengan Navbar
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
}

const MobileMenu = ({ isOpen, onClose, onNavigate, isAuthenticated, user, logout }: MobileMenuProps) => {
  const menuItems = [
    { label: "Home", target: "hero-section" },
    { label: "Kandidat", target: "kandidat-section" },
    { label: "Rundown", target: "rundown-section" },
    { label: "Feedback", target: "feedback-section" },
    { label: "FAQ", target: "faq-section" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-[#fdf8f4] z-[100] flex flex-col items-center gap-6 pt-8 pb-12 shadow-2xl transition-transform duration-300 lg:hidden ${isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      {/* HEADER */}
      <div className="w-full px-6 flex justify-between items-center mb-4">
        <div className="font-roster font-bold text-xl uppercase tracking-wider">NordByte</div>
        <button className="p-2" onClick={onClose}>
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* NAV LINKS */}
      <div className="flex flex-col items-center gap-4 font-retro text-xl w-full border-b-4 border-black pb-6">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full text-center py-1 hover:bg-magenta hover:text-white transition-colors uppercase tracking-widest"
            onClick={() => {
              onNavigate(item.target);
              onClose();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* AUTH SECTION */}
      <div className="w-full px-6 flex flex-col items-center gap-4 font-retro">
        {isAuthenticated && user ? (
          /* TAMPILAN SUDAH LOGIN */
          <div className="w-full flex flex-col items-center gap-3">
            {/* User Label (Seperti Header Dropdown) */}
            <div className="bg-navy text-white w-full py-2 px-4 text-center text-sm border-2 border-black shadow-[4px_4px_0px_0px_black] mb-2">
              <span className="opacity-70 text-[10px] block">LOGGED IN AS</span>
              <span className="font-bold">HI, {user.name}</span>
            </div>

            {/* Dashboard Button */}
            <Link href="/dashboard" className="w-full" onClick={onClose}>
              <div className="relative h-12 w-full group">
                <div className="absolute inset-0 bg-black rounded-sm"></div>
                <div className="relative h-full bg-magenta -translate-x-1 -translate-y-1 border-4 border-black flex items-center justify-center gap-2 group-active:translate-x-0 group-active:translate-y-0 transition-transform">
                  <LayoutDashboard size={20} className="text-white" />
                  <span className="text-white font-bold">DASHBOARD</span>
                </div>
              </div>
            </Link>

            {/* Logout Button */}
            <div
              onClick={async () => await logout()}
              className="w-full relative h-12 group font-retro"
            >
              <div className="absolute inset-0 bg-black rounded-sm"></div>
              <div className="relative h-full bg-red-500 -translate-x-1 -translate-y-1 border-4 border-black flex items-center justify-center gap-2 group-active:translate-x-0 group-active:translate-y-0 transition-transform">
                <LogOut size={20} className="text-white" />
                <span className="text-white font-bold uppercase text-sm tracking-wider">LOGOUT</span>
              </div>
            </div>
          </div>
        ) : (
          /* TAMPILAN BELUM LOGIN */
          <Link href="/login" className="w-full" onClick={onClose}>
            <div className="relative h-14 w-full group">
              <div className="absolute inset-0 bg-black rounded-sm"></div>
              <div className="relative h-full bg-navy -translate-x-1.5 -translate-y-1.5 border-4 border-black flex items-center justify-center group-active:translate-x-0 group-active:translate-y-0 transition-transform">
                <span className="text-white font-bold text-2xl uppercase">Login</span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;