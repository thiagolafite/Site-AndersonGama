import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Agendamento", path: "/agendamento" },
    { name: "Resultados", path: "/resultados" },
    { name: "Blog", path: "/blog" },
  ];

  const headerBg = isHome
    ? isScrolled
      ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
      : "bg-transparent border-transparent"
    : "bg-background/95 backdrop-blur-md border-b border-border shadow-sm";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        headerBg
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-wider text-white">ANDERSON</span>
          <span className="font-display text-2xl font-bold text-primary">PT</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary",
                location === link.path ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="ml-4">
            <Link href="/agendamento">Agendar Avaliação</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border py-4 px-4 shadow-lg flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-semibold uppercase tracking-wider",
                location === link.path ? "text-primary" : "text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="w-full mt-4" onClick={() => setIsMobileMenuOpen(false)}>
            <Link href="/agendamento">Agendar Avaliação</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
