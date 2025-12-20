import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CandidateSection from "@/components/sections/CandidatSection";

const Home = () => {
  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4">
        <HeroSection />
        <CandidateSection />
      </main>
    </>
  );
};

export default Home;