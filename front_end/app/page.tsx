"use client"; // Pastikan ini ada

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CandidateSection from "@/components/sections/CandidatSection"; // Typo fix: Candidat -> Candidate
import FeedbackSection from "@/components/sections/FeedbackSection";
import FaqSection from "@/components/sections/FaqSection";
import SectionDivider from "@/components/ui/SectionDivider";
import RundownSection from "@/components/sections/RundownSection";
import PixelLoader from "@/components/ui/PixelLoader"; // Import Loader
import LoveButton from "@/components/ui/LoveButton";

const Home = () => {
  // State untuk Loading
  const [isLoading, setIsLoading] = useState(true);

  // Mencegah scroll saat loading (Opsional tapi disarankan)
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  return (
    <>
      {/* WRAPPER UNTUK LOADER */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <PixelLoader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA */}
      {!isLoading && (
        <>
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

          <LoveButton/>
        </>
      )}
    </>
  );
};

export default Home;