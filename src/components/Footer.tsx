import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 py-8 text-center text-sm text-foreground/60 dark:border-white/10">
      <p>
        © {new Date().getFullYear()} {profile.name}. Built with Next.js.
      </p>
    </footer>
  );
}
