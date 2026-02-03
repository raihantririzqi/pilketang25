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
    name: "Musbar Ramadhan",
    nim: "125140051",
    base_color: "navy",
    kandidat_number: 1,
    vision: "Mewujudkan nortbyte'25 sebagai angkatan yang kolaboratif, seling menghargai perbedaan, serta bertumbuh bersama tanpa menghilangkan karakter masing masing",
    imageSrc: "/images/musbar.png",
    missions: [
      "N: Nyata dalam kolaborasi (mendorong kolaborasi yang nyata baik akademik dan non akademik tanpa memandang latar belakang ataupun kemapuan)",
      "O: open space untuk semua karakter (menciptakan ruangan yang terbuka dan inklusif dengan beragam minat dan karakter) ",
      "R: Ringan tapi rutin (interaksi sederhana namun menumbuhkan keakraban angkatan tanpa memberatkan) ",
      "T: Tumbuh bareng, bukan saling membandingkan",
      "H: Harmoni dalam perbedaan(menjaga keharmonisan dan komunikasi yang sehat ditengah perbedaan, kemampuan, dan karakter tanpa adanya diskriminasi terhadap individu tertentu)",
    ],
  },
  {
    name: "Seysar Rizky Sujadi",
    nim: "125140148",
    base_color: "green",
    kandidat_number: 2,
    vision: "menjadikan NordByte sebagai wadah untuk berkembang di bidang akademik maupun non akademik dengan tujuan menggali potensi diri dari masing-masing individu anggota Nordbyte.",
    imageSrc: "/images/seysar.png",
    missions: [
      "Menyediakan sebuah forum khusus untuk masing-masing bidang minat dan bakat.",
      "Membangun komunikasi yang aktif dan terbuka dengan tujuan memperkuat hubungan antara anggota.",
      "Membentuk BPA (Badan Pengurus Angkatan) dengan tujuan agar kedepannya dapat bekerjasama untuk menyukseskan berbagai prokja angkatan.",
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
      className="flex flex-col min-h-screen container mx-auto py-10 pt-24 lg:gap-2"
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
        <div className="w-full border-t border-2 lg:border-4 rounded-xl"></div>
        <div className="flex flex-col items-center font-roster text-xl lg:text-3xl px-2 text-center">
          <div className="flex gap-2">
            <div>Kandidat</div>
            <div>Calon</div>
          </div>
          <div className="flex gap-2">
            <div>Ketua</div>
            <div>Angkatan</div>
          </div>
        </div>
        <div className="w-full border-t border-2 lg:border-4 rounded-xl"></div>
      </motion.div>

      {/* HINT TEXT */}
      <motion.p
        variants={cardVariants}
        className="text-center text-xs lg:text-sm text-black/60 font-mono tracking-wide"
      >
        Ketuk kartu kandidat untuk melihat visi & misi
      </motion.p>

      {/* MOBILE (NO HEAVY ANIMATION) */}
      <div className="block lg:hidden">
        <CandidateCarousel data={candidatesData} />
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:flex justify-center gap-10 flex-wrap px-4">
        {candidatesData.map((candidate, index) => (
          <motion.div key={index} variants={cardVariants}>
            <CandidateCard
              name={candidate.name}
              nim={candidate.nim}
              base_color={candidate.base_color}
              kandidat_number={candidate.kandidat_number}
              vision={candidate.vision}
              missions={candidate.missions}
              imageSrc={candidate.imageSrc}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CandidateSection;
