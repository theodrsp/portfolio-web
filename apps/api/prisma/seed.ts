import "dotenv/config";

import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  // Admin
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD!, 12);
  await prisma.adminUser.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL! },
    update: { passwordHash },
    create: { email: process.env.SEED_ADMIN_EMAIL!, passwordHash },
  });

  // Profile (satu baris, id = 1)
  const profile = {
    nameDisplay: "Timotius Theodearson",
    headlineId: "Pengajar IT dan Fullstack Developer",
    headlineEn: "IT Educator and Fullstack Developer",
    bioId: "Teks sementara. Ganti dengan bio aslimu.",
    bioEn: "Placeholder text. Replace with your real bio.",
    email: "theodrsp@gmail.com",
    whatsapp: "085609289685",
    linkedinUrl: "https://www.linkedin.com/in/timotius-theodearson-975624286/",
    githubUrl: "https://github.com/theodrsp",
    teachingPhilosophyId: "Pemrograman bukan sekadar sintaks, tetapi cara berpikir kritis dan menyelesaikan masalah secara kreatif.",
    teachingPhilosophyEn: "Programming is not just about syntax, but a way to think critically and solve problems creatively.",
    projectsDoneCount: 12,
    teachingYears: 3,
    studentsTaught: 40,
  };
  await prisma.profile.upsert({ where: { id: 1 }, update: profile, create: { id: 1, ...profile } });

  // Tabel tanpa kunci unik: kosongkan lalu isi ulang
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      { name: "TypeScript", category: "Frontend", level: 3, iconKey: "typescript", order: 1, showInStrip: true },
      { name: "Next.js", category: "Frontend", level: 3, iconKey: "nextjs", order: 2, showInStrip: true },
      { name: "Express.js", category: "Backend", level: 3, iconKey: "express", order: 3, showInStrip: true },
      { name: "PostgreSQL", category: "Database", level: 2, iconKey: "postgresql", order: 4, showInStrip: true },
      { name: "Scratch 3.0", category: "Mengajar", level: 5, iconKey: "scratch", order: 5, showInStrip: false },
    ],
  });

  await prisma.teachingTool.deleteMany();
  await prisma.teachingTool.createMany({
    data: [
      { name: "Scratch 3.0", descriptionId: "Logika pemrograman lewat blok visual.", descriptionEn: "Programming logic through visual blocks.", ageRange: "7-12 tahun", order: 1 },
      { name: "Roblox Studio", descriptionId: "Membuat game 3D dengan Lua.", descriptionEn: "Building 3D games with Lua.", ageRange: "10-15 tahun", order: 2 },
      { name: "Python", descriptionId: "Dasar pemrograman teks dan game terminal.", descriptionEn: "Text-based programming and terminal games.", ageRange: "12-17 tahun", order: 3 },
      { name: "Python AI/ML", descriptionId: "Pengenalan machine learning untuk remaja.", descriptionEn: "Introduction to machine learning for teens.", ageRange: "14-17 tahun", order: 4 },
    ],
  });

  // Project APP
  const apps = [
    { slug: "portofolio-web", titleId: "Website Portofolio", titleEn: "Portfolio Website", tags: ["Next.js", "Express", "PostgreSQL"], featured: true, order: 1 },
    { slug: "insan-otomasi", titleId: "Insan Otomasi", titleEn: "Insan Otomasi", tags: ["HTML", "CSS", "Bootstrap", "JavaScript"], featured: false, order: 2 },
    { slug: "kagemaya-id", titleId: "Kagemaya.id", titleEn: "Kagemaya.id", tags: ["Next.js", "TypeScript"], featured: true, order: 3 },
  ];
  for (const a of apps) {
    const data = {
      ...a,
      type: "APP" as const,
      summaryId: "Ringkasan singkat (ganti nanti).",
      summaryEn: "Short summary (replace later).",
      descriptionId: "Deskripsi lengkap (ganti nanti).",
      descriptionEn: "Full description (replace later).",
      images: [],
      status: "PUBLISHED" as const,
    };
    await prisma.project.upsert({ where: { slug: a.slug }, update: data, create: data });
  }

  // Karya murid: DRAFT sampai ada persetujuan orang tua
  const student = {
    slug: "contoh-game-scratch",
    type: "STUDENT_WORK" as const,
    titleId: "Game Petualangan Scratch",
    titleEn: "Scratch Adventure Game",
    summaryId: "Contoh karya murid (data contoh).",
    summaryEn: "Sample student work (sample data).",
    descriptionId: "Penjelasan detail karya (data contoh).",
    descriptionEn: "Detailed explanation (sample data).",
    tags: ["Scratch"],
    images: ["/placeholder/scratch-1.png"],
    tool: "Scratch",
    studentDisplayName: "Andi",
    studentAgeRange: "9-10 tahun",
    learningOutcomesId: "Variabel, perulangan, dan kondisi.",
    learningOutcomesEn: "Variables, loops, and conditionals.",
    status: "DRAFT" as const,
    order: 10,
  };
  await prisma.project.upsert({ where: { slug: student.slug }, update: student, create: student });

  console.log("Seed selesai");
}

main().finally(() => prisma.$disconnect());