export const profile = {
  name: "Sunny Shah",
  title: "Conference Emcee & Speaker",
  tagline:
    "Comedy, storytelling, and authenticity that keeps audiences engaged and laughing.",
  email: "sunnyshah1000@gmail.com",
  location: "Earth",
  social: {
    github: "https://github.com/sunnyshah1000",
    linkedin: "https://linkedin.com/in/sunnyshah1000",
  },
  about: `Hi, I'm Sunny. I host and emcee conferences, corporate events, and
    galas — bringing comedy, storytelling, and genuine energy to keep a room
    engaged. This site is a work in progress; edit src/lib/data.ts to make
    it yours.`,
};

export type SpeakingItem = {
  title: string;
  context: string;
  period: string;
  description: string;
};

export const speaking: SpeakingItem[] = [
  {
    title: "Conference Emcee",
    context: "Freelance",
    period: "2024 — Present",
    description:
      "What you do day to day — the kinds of events you host, your style, and a standout moment or two.",
  },
  {
    title: "Host & Speaker",
    context: "Earlier work",
    period: "2022 — 2024",
    description:
      "Where you got your start hosting or speaking. Focus on the moment it clicked.",
  },
];
