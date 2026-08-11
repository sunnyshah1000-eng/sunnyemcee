import Link from "next/link";
import { profile } from "@/lib/data";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#speaking", label: "Speaking" },
  { href: "/writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-lg italic">
          {profile.name}
        </Link>
        <nav className="flex gap-6 text-xs tracking-[0.15em] text-muted uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
