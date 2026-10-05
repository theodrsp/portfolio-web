import { localizeProfile, localizeProject } from "@/lib/localize";
import { profileSchema, publicProjectSchema, skillSchema } from "@portfolio/shared";

import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StudentWorksSection } from "@/components/sections/StudentWorksSection";
import { fetchApi } from "@/lib/api";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { z } from "zod";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const profile = localizeProfile(await fetchApi("/profile", profileSchema), locale);

  const title = `${profile.nameDisplay} | ${profile.headline}`;
  const description =
    profile.bio.length > 155 ? `${profile.bio.slice(0, 152)}…` : profile.bio;

  // { id: "/id", en: "/en", "x-default": "/id" }, otomatis mengikuti daftar bahasa di routing
  const languages = {
    ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    "x-default": `/${routing.defaultLocale}`,
  };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: profile.nameDisplay,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [rawProfile, skills, rawApps, rawStudentWorks] = await Promise.all([
    fetchApi("/profile", profileSchema),
    fetchApi("/skills", z.array(skillSchema)),
    fetchApi("/projects?type=APP", z.array(publicProjectSchema)),
    fetchApi("/projects?type=STUDENT_WORK", z.array(publicProjectSchema)),
  ]);

  const profile = localizeProfile(rawProfile, locale);
  const appProjects = rawApps.map((p) => localizeProject(p, locale));
  const studentWorks = rawStudentWorks.map((p) => localizeProject(p, locale));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.nameDisplay,
    jobTitle: profile.headline,
    url: `${process.env.SITE_URL}/${locale}`,
    sameAs: [profile.linkedinUrl, profile.githubUrl],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main id="konten" tabIndex={-1} className="pt-16 outline-none">
        <HeroSection profile={profile} skills={skills} />
        <ProjectsSection projects={appProjects} />
        <StudentWorksSection works={studentWorks} />
        <AboutSection profile={profile} />
        <ContactSection profile={profile} />
      </main>
      <Footer nameDisplay={profile.nameDisplay} />
    </>
  );
}