import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          ⚽ Sport Analyzer
        </Link>
        <nav className="text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-100 transition-colors">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
