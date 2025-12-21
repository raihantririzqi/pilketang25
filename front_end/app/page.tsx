import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CandidateSection from "@/components/sections/CandidatSection";
import FeedbackSection from "@/components/sections/FeedbackSection";
import FaqSection from "@/components/sections/FaqSection";
import SectionDivider from "@/components/ui/SectionDivider";
import RundownSection from "@/components/sections/RundownSection";

const Home = () => {
  return (
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
    </>
  );
};

export default Home;
