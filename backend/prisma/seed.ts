import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { v4 as uuidv4 } from "uuid";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Deleting old candidates...");

  // 1. Create atau Update VotingSession (Pilketang 2025)
  const session = await prisma.votingSession.upsert({
    where: { id: "session_pilketang_2025" },
    update: { is_active: true },
    create: {
      id: "session_pilketang_2025",
      start_time: new Date(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      is_active: true,
      is_published: false,
    },
  });
  console.log("✅ VotingSession created:", session.id);

  // 2. Data Kandidat Caketang NordByte '25
  const candidates = [
    {
      id: uuidv4(),
      name: "MUSBAR RAMADHAN",
      nim: "125140051",
      vision: "Mewujudkan nortbyte'25 sebagai angkatan yang kolaboratif, saling menghargai perbedaan, serta bertumbuh bersama tanpa menghilangkan karakter masing masing",
      mission: "N: Nyata dalam kolaborasi (mendorong kolaborasi yang nyata baik akademik dan non akademik tanpa memandang latar belakang ataupun kemampuan)\nO: open space untuk semua karakter (menciptakan ruangan yang terbuka dan inklusif dengan beragam minat dan karakter)\nR: Ringan tapi rutin (interaksi sederhana namun menumbuhkan keakraban angkatan tanpa memberatkan)\nT: Tumbuh bareng, bukan saling membandingkan\nH: Harmoni dalam perbedaan (menjaga keharmonisan dan komunikasi yang sehat ditengah perbedaan, kemampuan, dan karakter tanpa adanya diskriminasi terhadap individu tertentu)"
    },
    {
      id: uuidv4(),
      name: "SEYSAR RIZKY SUJADI",
      nim: "125140148",
      vision: "menjadikan NordByte sebagai wadah untuk berkembang di bidang akademik maupun non akademik dengan tujuan menggali potensi diri dari masing-masing individu anggota Nordbyte.",
      mission: "1. Menyediakan sebuah forum khusus untuk masing-masing bidang minat dan bakat.\n2. Membangun komunikasi yang aktif dan terbuka dengan tujuan memperkuat hubungan antara anggota.\n3. Membentuk BPA (Badan Pengurus Angkatan) dengan tujuan agar kedepannya dapat bekerjasama untuk menyukseskan berbagai prokja angkatan."
    },
  ];

  for (const candidate of candidates) {
    const created = await prisma.candidate.upsert({
      where: { nim: candidate.nim },
      update: {
        name: candidate.name,
        vision: candidate.vision,
        mission: candidate.mission,
      },
      create: candidate,
    });
    console.log("✅ Candidate created:", created.name);
  }

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });