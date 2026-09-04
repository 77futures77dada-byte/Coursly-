import type { TutorCardData } from "@/components/match/TutorCard";

/** Static sample data for building UI before the DB is wired. Not shipped. */
export const MOCK_TUTORS: TutorCardData[] = [
  {
    slug: "maria-tamm",
    name: "Maria Tamm",
    headline: "Matemaatika · gümnaasium ja riigieksam",
    subjects: ["Mathematics", "Physics"],
    languages: ["et", "en"],
    priceHour: 28,
    rating: 4.9,
    reviewCount: 63,
    matchScore: 94,
  },
  {
    slug: "andrei-kuznetsov",
    name: "Andrei Kuznetsov",
    headline: "Английский язык — разговорный и IELTS",
    subjects: ["English"],
    languages: ["ru", "en"],
    priceHour: 22,
    rating: 4.8,
    reviewCount: 41,
    matchScore: 88,
  },
  {
    slug: "liis-saar",
    name: "Liis Saar",
    headline: "Chemistry & biology, exam preparation",
    subjects: ["Chemistry", "Biology"],
    languages: ["et", "en"],
    priceHour: 25,
    rating: 4.7,
    reviewCount: 29,
    matchScore: 81,
  },
];
