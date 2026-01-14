"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ===============================
   ANIMATION VARIANTS
================================ */

// container / section
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

// item
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* ===============================
   COMPONENT
================================ */

const FaqSection = () => {
  return (
    <motion.section
      id="faq-section"
      className="w-full"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* ================= FAQ ================= */}
      <motion.div
        className="container mx-auto px-6 py-20"
        variants={cardVariants}
      >
        <h2 className="font-roster text-3xl lg:text-4xl mb-10 text-center lg:text-left">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {/* FAQ 1: TENTANG ACARA (Updated) */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-roster text-lg uppercase">
              Apa itu PEDULI HATI?
            </AccordionTrigger>
            <AccordionContent className="font-mono text-gray-600 leading-relaxed">
              <strong>PEDULI HATI</strong> adalah singkatan dari <em>"PEmilihan DUa LIma Harapan Anak Teknik Informatika"</em>.
              <br /><br />
              Ini merupakan acara resmi pemilihan <strong>Ketua Angkatan Mahasiswa Teknik Informatika 2025</strong>.
              Platform ini dibangun untuk memfasilitasi proses demokrasi tersebut secara modern, transparan, dan berbasis teknologi (E-Voting Kiosk).
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 2: ALUR VOTING */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-roster text-lg uppercase">
              Bagaimana cara memilih?
            </AccordionTrigger>
            <AccordionContent className="font-mono text-gray-600 leading-relaxed">
              Prosesnya mudah dan futuristik:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Login menggunakan akun Google Itera/Mahasiswa kamu.</li>
                <li>Masuk ke Dashboard dan klik <strong>Generate Ticket</strong> untuk dapat QR Code.</li>
                <li>Bawa HP-mu ke <strong>Bilik Suara</strong> dan arahkan qr ke laptop yang tersedia.</li>
                <li>Lakukan pencoblosan kandidat pada <strong>Laptop/Layar yang tersedia</strong> di bilik.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          {/* FAQ 3: KEAMANAN */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-roster text-lg uppercase">
              Apakah data saya aman?
            </AccordionTrigger>
            <AccordionContent className="font-mono text-gray-600 leading-relaxed">
              <strong>100% Aman.</strong> Kami menggunakan sistem <em>One-Time-Token</em> di mana QR Code hanya berlaku sekali scan
              dan akan hangus otomatis dalam 30 detik. Data suara disimpan secara <strong>Anonim</strong> di database,
              sehingga siapapun tidak bisa melacak pilihanmu.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* ================= CTA ================= */}
      <motion.div
        variants={cardVariants}
        className="text-center py-16 px-4"
      >
        <h3 className="font-roster text-2xl lg:text-4xl text-orange-600">
          GAME OVER IF YOU DON'T VOTE!
        </h3>
      </motion.div>

      {/* ================= FOOTER ================= */}
      {/* ❌ footer TANPA animasi (best practice) */}
      <footer className="relative bg-[#e84797] text-white w-full pt-24 border-t-4 border-black">

        {/* LOGO BULAT (Floating) */}
        <div
          className="
            absolute
            -top-12
            left-1/2
            -translate-x-1/2
            lg:left-24
            lg:translate-x-0
            w-24 h-24
            lg:w-28 lg:h-28
            bg-white
            rounded-full
            flex items-center justify-center
            border-4 border-black
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          "
        >
          <Image
            src="/images/logo.png"
            alt="Logo Peduli Hati"
            fill
            className="object-contain p-2"
          />
        </div>

        <div
          className="
            max-w-7xl mx-auto
            px-6 pb-12
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-10
            font-retro
            text-sm
          "
        >
          {/* LAJUR 1: JENAMA & DESKRIPSI */}
          <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
            <h3 className="font-roster text-2xl text-yellow-300">PEDULI HATI</h3>
            <p className="leading-relaxed opacity-90">
              <strong>PE</strong>milihan <strong>DU</strong>a <strong>LI</strong>ma <strong>HA</strong>rapan <strong>A</strong>nak <strong>T</strong>eknik <strong>I</strong>nformatika.
            </p>
            <p className="text-xs opacity-75">
              Platform E-Voting rasmi untuk pemilihan Ketua Angkatan Teknik Informatika ITERA 2025. Jujur, Adil, & Telus.
            </p>
          </div>

          {/* LAJUR 2: MAKLUMAT HUBUNGI */}
          <div className="flex flex-col gap-3 text-center lg:text-left items-center lg:items-start">
            <h4 className="font-roster text-xl mb-1 text-yellow-300">CONTACT BASE</h4>

            {/* ALAMAT (Pautan Google Maps) */}
            <div className="flex items-start gap-2">
              <span>📍</span>
              <a
                href="https://maps.google.com/?cid=915303199932108582&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition-colors hover:underline text-left"
              >
                Jl. Terusan Ryacudu, Way Huwi, Jati Agung (ITERA)
              </a>
            </div>

            {/* E-MEL (Pautan Mailto) */}
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <a
                href="mailto:informatisciter25@gmail.com"
                className="hover:text-yellow-300 transition-colors hover:underline"
              >
                informatisciter25@gmail.com
              </a>
            </div>

            {/* WHATSAPP (Pautan Wa.me) */}
            <div className="flex items-center gap-2">
              <span>📞</span>
              <a
                href="https://wa.me/6281298911597"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition-colors hover:underline"
              >
                +62 812-9891-1597
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span>📷</span>
              <a href="https://instagram.com/nordbyte.25" target="_blank" className="hover:text-yellow-300 transition-colors underline decoration-dotted">
                @nordbyte.25
              </a>
            </div>
          </div>

          {/* LAJUR 3: PAUTAN PANTAS */}
          <div className="flex flex-col gap-3 text-center lg:text-left items-center lg:items-start">
            <h4 className="font-roster text-xl mb-1 text-yellow-300">QUICK LINKS</h4>
            <a href="#hero-section" className="hover:text-yellow-300 transition-colors hover:translate-x-1 duration-200">Home</a>
            <a href="#candidate-section" className="hover:text-yellow-300 transition-colors hover:translate-x-1 duration-200">Kandidat</a>
            <a href="#rundown-section" className="hover:text-yellow-300 transition-colors hover:translate-x-1 duration-200">Rundown</a>
            <a href="#feedback-section" className="hover:text-yellow-300 transition-colors hover:translate-x-1 duration-200">Feedback</a>
            <a href="#faq-section" className="hover:text-yellow-300 transition-colors hover:translate-x-1 duration-200">FAQ</a>
          </div>
        </div>

        {/* BAR HAK CIPTA */}
        <div className="w-full bg-black py-4 text-center font-retro text-xs text-white/60">
          <p>© 2025 PEDULI HATI SYSTEM. MADE WITH 💻 & ☕ BY PANITIA.</p>
        </div>
      </footer>
    </motion.section>
  );
};

export default FaqSection;
