import type { TutorCardData } from "@/components/match/TutorCard";

/**
 * Static sample data for building UI before the DB is wired. Not shipped.
 *
 * `matchScore` here is a placeholder, not a real computation. Only render it
 * (via `<TutorCard showMatchScore />`) in a context where the score was actually
 * derived from a user's survey answers — never on the landing page or unfiltered
 * search, where it would be misleading.
 */
export const MOCK_TUTORS: TutorCardData[] = [
  {
    slug: "maria-tamm",
    name: "Maria Tamm",
    headline: {
      et: "Matemaatika · gümnaasium ja riigieksam",
      ru: "Математика · гимназия и госэкзамен",
      en: "Mathematics · gymnasium and state exam",
    },
    subjectSlugs: ["mathematics", "physics"],
    languages: ["et", "en"],
    priceHour: 28,
    rating: 4.9,
    reviewCount: 63,
    matchScore: 94,
  },
  {
    slug: "andrei-kuznetsov",
    name: "Andrei Kuznetsov",
    headline: {
      et: "Inglise keel — kõnekeel ja IELTS",
      ru: "Английский язык — разговорный и IELTS",
      en: "English — conversation and IELTS",
    },
    subjectSlugs: ["english"],
    languages: ["ru", "en"],
    priceHour: 22,
    rating: 4.8,
    reviewCount: 41,
    matchScore: 88,
  },
  {
    slug: "liis-saar",
    name: "Liis Saar",
    headline: {
      et: "Keemia ja bioloogia, eksamiks valmistumine",
      ru: "Химия и биология, подготовка к экзамену",
      en: "Chemistry and biology, exam preparation",
    },
    subjectSlugs: ["chemistry", "biology"],
    languages: ["et", "en"],
    priceHour: 25,
    rating: 4.7,
    reviewCount: 29,
    matchScore: 81,
  },
];
