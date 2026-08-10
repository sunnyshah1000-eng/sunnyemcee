export const profile = {
  name: "Sunny Shah",
  title: "Software Engineer",
  tagline: "I build clean, useful software and occasionally write about it.",
  email: "sunnyshah1000@gmail.com",
  location: "Earth",
  social: {
    github: "https://github.com/sunnyshah1000",
    linkedin: "https://linkedin.com/in/sunnyshah1000",
  },
  about: `Hi, I'm Sunny. I'm a software engineer who enjoys turning ideas into
    working products — from backend systems to polished front ends. This
    site is a work in progress; edit src/lib/data.ts to make it yours.`,
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
    slug: "project-one",
    name: "Project One",
    description:
      "A short description of a project you've built. Swap this out with something real.",
    tags: ["TypeScript", "Next.js"],
    link: "#",
    repo: "#",
  },
  {
    slug: "project-two",
    name: "Project Two",
    description:
      "Another project worth showing off. Add a link to a live demo or the repo.",
    tags: ["Python", "APIs"],
    repo: "#",
  },
  {
    slug: "project-three",
    name: "Project Three",
    description:
      "A third project. Three is a good minimum for a first pass at a portfolio.",
    tags: ["React", "Design"],
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
    role: "Software Engineer",
    org: "Your Current Company",
    period: "2024 — Present",
    description:
      "What you do day to day. Mention the stack, the team, and an outcome or two.",
  },
  {
    role: "Software Engineer",
    org: "A Previous Company",
    period: "2022 — 2024",
    description:
      "A prior role. Focus on impact: what shipped, what improved, what you owned.",
  },
];

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
};

export const education: EducationItem[] = [
  {
    school: "Your University",
    degree: "B.S. in Computer Science",
    period: "2018 — 2022",
  },
];
