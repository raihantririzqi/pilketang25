"use client";

import { motion, Variants } from "framer-motion";
import CandidateCard from "../ui/CandidatCard";
import CandidateCarousel from "../ui/CandidatCarousel";
import { cardVariants, sectionVariants } from "../common/animation";

const easeOut = [0.16, 1, 0.3, 1];


/* ===============================
   DATA
================================ */
const candidatesData = [
  {
    name: "Raihan Tri rizqi Wibowo",
    nim: "125140125",
    base_color: "magenta",
    kandidat_number: 1,
    vision:
      "Menjadikan angkatan yang solid, aktif, dan berdampak positif bagi lingkungan kampus.",
    missions: [
      "Meningkatkan solidaritas antar mahasiswa",
      "Mewadahi aspirasi dan kreativitas angkatan",
      "Membangun komunikasi yang transparan",
    ],
  },
  {
    name: "Calon Ketua Kedua",
    nim: "125140126",
    base_color: "navy",
    kandidat_number: 2,
    vision:
      "Mewujudkan angkatan yang kolaboratif dan adaptif terhadap perubahan.",
    missions: [
      "Mendorong budaya diskusi terbuka",
      "Menguatkan peran akademik dan non-akademik",
      "Menjadi jembatan aspirasi mahasiswa",
    ],
  },
];

/* ===============================
   COMPONENT
================================ */
const CandidateSection = () => {
  return (
    <motion.section
      id="kandidat-section"
      className="flex flex-col min-h-screen container mx-auto py-10 pt-24 md:gap-2"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }} // ringan & responsif
    >
      {/* HEADER */}
      <motion.div
        className="flex items-center gap-4 px-4"
        variants={cardVariants}
      >
        <div className="w-full border-t border-2 md:border-4 rounded-xl"></div>
        <div className="flex flex-col items-center font-roster text-xl md:text-3xl px-2 text-center">
          <div className="flex gap-2">
            <div>Kandidat</div>
            <div>Calon</div>
          </div>
          <div className="flex gap-2">
            <div>Ketua</div>
            <div>Angkatan</div>
          </div>
        </div>
        <div className="w-full border-t border-2 md:border-4 rounded-xl"></div>
      </motion.div>

      {/* HINT TEXT */}
      <motion.p
        variants={cardVariants}
        className="text-center text-xs md:text-sm text-black/60 font-mono tracking-wide"
      >
        Ketuk kartu kandidat untuk melihat visi & misi
      </motion.p>

      {/* MOBILE (NO HEAVY ANIMATION) */}
      <div className="block md:hidden">
        <CandidateCarousel data={candidatesData} />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex justify-center gap-10 flex-wrap px-4">
        {candidatesData.map((candidate, index) => (
          <motion.div key={index} variants={cardVariants}>
            <CandidateCard
              name={candidate.name}
              nim={candidate.nim}
              base_color={candidate.base_color}
              kandidat_number={candidate.kandidat_number}
              vision={candidate.vision}
              missions={candidate.missions}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CandidateSection;
