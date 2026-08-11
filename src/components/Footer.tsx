import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10 text-center text-xs tracking-[0.15em] text-muted uppercase">
      {profile.name} · {new Date().getFullYear()}
    </footer>
  );
}
