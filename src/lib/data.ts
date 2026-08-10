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

export type Project = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "highlight-one",
    name: "Tech Conference Keynote",
    description:
      "A short description of this event — the audience, the vibe, what made it memorable. Swap this out with something real.",
    tags: ["Keynote", "Corporate"],
    link: "#",
  },
  {
    slug: "highlight-two",
    name: "Comedy Night Hosting",
    description:
      "Another highlight worth showing off. Add a link to a video clip if you have one.",
    tags: ["Comedy", "Live"],
    link: "#",
  },
  {
    slug: "highlight-three",
    name: "Corporate Gala",
    description:
      "A third highlight. Three is a good minimum for a first pass at a reel.",
    tags: ["Gala", "Emcee"],
    link: "#",
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Conference Emcee",
    org: "Freelance",
    period: "2024 — Present",
    description:
      "What you do day to day — the kinds of events you host, your style, and a standout moment or two.",
  },
  {
    role: "Host & Speaker",
    org: "Earlier Work",
    period: "2022 — 2024",
    description:
      "Where you got your start hosting or speaking. Focus on the moment it clicked.",
  },
];
