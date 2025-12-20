"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  return (
    <section id="faq-section" className="w-full">

      {/* ================= FAQ ================= */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="font-roster text-3xl md:text-4xl mb-10 text-center md:text-left">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Apa itu Peduli Hati?</AccordionTrigger>
            <AccordionContent>
              Peduli Hati adalah platform untuk meningkatkan partisipasi
              dan kepedulian masyarakat dalam proses pemilihan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Bagaimana cara memilih kandidat?</AccordionTrigger>
            <AccordionContent>
              Kamu dapat melihat daftar kandidat, mempelajari profilnya,
              lalu memberikan suara sesuai pilihanmu.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Apakah data saya aman?</AccordionTrigger>
            <AccordionContent>
              Ya. Kami menjaga keamanan data pengguna dan tidak
              menyalahgunakan informasi pribadi.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ================= CTA ================= */}
      <div className="text-center py-16 px-4">
        <h3 className="font-roster text-2xl md:text-4xl text-orange-600">
          GAME OVER IF YOU DON&apos;T VOTE!
        </h3>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative bg-magenta text-white w-full pt-24">
        
        {/* LOGO BULAT */}
        <div
          className="
            absolute
            -top-12
            left-1/2
            -translate-x-1/2
            md:left-24
            md:translate-x-0
            w-24 h-24
            md:w-28 md:h-28
            bg-white
            rounded-full
            flex items-center justify-center
          "
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain p-3"
          />
        </div>

        {/* FOOTER CONTENT */}
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
          {/* Desc */}
          <div className="flex flex-col gap-4 max-w-sm mx-auto md:mx-0 text-center md:text-left">
            <p className="leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h4 className="font-bold text-lg">Contact Us</h4>
            <p>Jl. Terusan Ryacudu, Kec. Jati Agung</p>
            <p>informatisciter25@gmail.com</p>
            <p>+62 812-9891-1597</p>
            <p>@nordbyte.25</p>
          </div>

          {/* Pages */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h4 className="font-bold text-lg">Pages</h4>
            <a href="#hero-section" className="hover:underline">Home</a>
            <a href="#kandidat-section" className="hover:underline">Kandidat</a>
            <a href="#feedback-section" className="hover:underline">Feedback</a>
            <a href="#faq-section" className="hover:underline">FAQ</a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default FaqSection;
