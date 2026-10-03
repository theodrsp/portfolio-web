import { profileSchema, publicProjectSchema, skillSchema } from "@portfolio/shared";

import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { fetchApi } from "@/lib/api";
import { z } from "zod";

export default async function Home() {
  const [profile, skills, appProjects] = await Promise.all([
    fetchApi("/profile", profileSchema),
    fetchApi("/skills", z.array(skillSchema)),
    fetchApi("/projects?type=APP", z.array(publicProjectSchema)),
  ]);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection profile={profile} skills={skills} />
        <ProjectsSection projects={appProjects} />
        <section id="karya-murid" className="min-h-screen p-8 border-b border-line/30">
          <h2 className="font-heading text-3xl mb-4 text-washi">Karya Murid</h2>
        </section>
        <AboutSection profile={profile} />
        <section id="kontak" className="min-h-screen p-8">
          <h2 className="font-heading text-3xl mb-4 text-washi">Kontak</h2>
        </section>
      </main>
    </>
  );
}