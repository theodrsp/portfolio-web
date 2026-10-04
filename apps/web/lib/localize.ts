import type { profileSchema, publicProjectSchema } from "@portfolio/shared";

import type { Locale } from "@/i18n/routing";
import type { z } from "zod";

type Profile = z.infer<typeof profileSchema>;
type Project = z.infer<typeof publicProjectSchema>;

export function localizeProfile(p: Profile, locale: Locale) {
  const en = locale === "en";
  const {
    headlineId, headlineEn,
    bioId, bioEn,
    teachingPhilosophyId, teachingPhilosophyEn,
    ...rest
  } = p;

  return {
    ...rest,
    headline: en ? headlineEn : headlineId,
    bio: en ? bioEn : bioId,
    teachingPhilosophy: (en ? teachingPhilosophyEn : teachingPhilosophyId) ?? null,
  };
}

export function localizeProject(p: Project, locale: Locale) {
  const en = locale === "en";
  const {
    titleId, titleEn,
    summaryId, summaryEn,
    descriptionId, descriptionEn,
    learningOutcomesId, learningOutcomesEn,
    ...rest
  } = p;

  return {
    ...rest,
    title: en ? titleEn : titleId,
    summary: en ? summaryEn : summaryId,
    description: en ? descriptionEn : descriptionId,
    learningOutcomes: en ? learningOutcomesEn : learningOutcomesId,
  };
}

export type LocalizedProfile = ReturnType<typeof localizeProfile>;
export type LocalizedProject = ReturnType<typeof localizeProject>;