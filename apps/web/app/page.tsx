import { profileSchema, publicProjectSchema, skillSchema } from "@portfolio/shared";

import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StudentWorksSection } from "@/components/sections/StudentWorksSection";
import { fetchApi } from "@/lib/api";
import { z } from "zod";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchApi("/profile", profileSchema);

  const title = `${profile.nameDisplay} | ${profile.headlineId}`;
  const description =
    profile.bioId.length > 155 ? `${profile.bioId.slice(0, 152)}…` : profile.bioId;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: profile.nameDisplay,
      locale: "id_ID",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home() {
  const [profile, skills, appProjects, studentWorks] = await Promise.all([
    fetchApi("/profile", profileSchema),
    fetchApi("/skills", z.array(skillSchema)),
    fetchApi("/projects?type=APP", z.array(publicProjectSchema)),
    fetchApi("/projects?type=STUDENT_WORK", z.array(publicProjectSchema)),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.nameDisplay,
    jobTitle: profile.headlineId,
    url: process.env.SITE_URL,
    sameAs: [profile.linkedinUrl, profile.githubUrl],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main className="pt-16">
        <HeroSection profile={profile} skills={skills} />
        <ProjectsSection projects={appProjects} />
        <StudentWorksSection works={studentWorks} />
        <AboutSection profile={profile} />
        <ContactSection profile={profile} />
      </main>
    </>
  );
}