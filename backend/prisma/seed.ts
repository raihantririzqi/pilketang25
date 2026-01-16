import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { v4 as uuidv4 } from "uuid";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root123",
  database: "pilketang25",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Deleting old candidates...");

  // 1. Create VotingSession (aktif)
  const session = await prisma.votingSession.upsert({
    where: { id: "session_pilketang_2025" },
    update: {
      is_active: true,
    },
    create: {
      id: "session_pilketang_2025",
      start_time: new Date(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
      is_active: true,
      is_published: false,
    },
  });
  console.log("✅ VotingSession created:", session.id);

  // 2. Create Candidates
  const candidates = [
    {
      id: uuidv4(),
      name: "Kandidat 1",
      nim: "120140001",
      vision: "Mewujudkan angkatan yang solid dan berprestasi",
      mission:
        "1. Meningkatkan kebersamaan antar mahasiswa\n2. Mendorong prestasi akademik dan non-akademik\n3. Membangun komunikasi yang baik dengan dosen",
    },
    {
      id: uuidv4(),
      name: "Kandidat 2",
      nim: "120140002",
      vision: "Membangun angkatan yang inovatif dan kreatif",
      mission:
        "1. Mengadakan kegiatan pengembangan skill\n2. Membuat wadah kreativitas mahasiswa\n3. Menjalin kerjasama dengan industri",
    },
  ];

  for (const candidate of candidates) {
    const created = await prisma.candidate.upsert({
      where: { nim: candidate.nim },
      update: {
        id: candidate.id,
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