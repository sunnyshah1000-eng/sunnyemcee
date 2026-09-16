import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Content Coach",
    short_name: "Coach",
    description:
      "A warm, voice-first coaching conversation about the content you create.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#e2461b",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
