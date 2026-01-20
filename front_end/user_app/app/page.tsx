"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CandidateSection from "@/components/sections/CandidatSection";
import FeedbackSection from "@/components/sections/FeedbackSection";
import FaqSection from "@/components/sections/FaqSection";
import SectionDivider from "@/components/ui/SectionDivider";
import RundownSection from "@/components/sections/RundownSection";
import PixelLoader from "@/components/ui/NeoLoader";
import FloatingHearts from "@/components/ui/FloatingHearts";
import ScrollConfetti from "@/components/ui/ScrollConfetti";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <PixelLoader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        // WRAPPER UTAMA (Relative & Background Color)
        <div className="relative min-h-screen bg-background">

          {/* --- BACKGROUND PATTERN (Diterapkan Global) --- */}
          {/* Menggunakan h-full agar memanjang sampai bawah mengikuti konten */}
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

          {/* --- VALENTINE LOVE AURA --- */}
          <FloatingHearts />
          <ScrollConfetti targetId="kandidat-section" />

          {/* --- KONTEN HALAMAN (Z-10 agar di atas pattern) --- */}
          <div className="relative z-10">
            <Navbar />

            <main className="container mx-auto px-4">

              <HeroSection />

              <SectionDivider />

              <CandidateSection />

              <SectionDivider />

              <RundownSection />

              <SectionDivider />

              <FeedbackSection />
            </main>

            <SectionDivider />

            <FaqSection />
          </div>

        </div>
      )}
    </>
  );
};

export default Home;