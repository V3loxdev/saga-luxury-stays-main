import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/sogo-hotel-logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
  { label: "Foods", to: "/foods" },
  { label: "Booking", to: "/booking" },
  { label: "Promos", to: "/promos" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-dark/98 backdrop-blur-md border-dark-border shadow-lg shadow-dark/20 h-14"
          : "bg-dark/80 backdrop-blur-sm border-transparent h-16"
      }`}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
<button
          onClick={() => window.location.reload()}
          className={`flex items-center gap-2 transition-all duration-500 p-0 border-none bg-transparent cursor-pointer hover:scale-105 active:scale-95 ${
            scrolled ? "h-8" : "h-10"
          }`}
          aria-label="Reload Sogo Hotel Home"
        >
          <img 
src={logo} 
            alt="Sogo Hotel Logo" 
            className={`object-contain w-auto transition-all duration-500 ${scrolled ? "h-8" : "h-10"}`} 
          />
          <span className="gold-shimmer font-display tracking-wide text-base md:text-lg hidden sm:inline">
            SAGA HOTEL
          </span>
        </button>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm font-medium tracking-wide transition-colors duration-300 group ${
                pathname === link.to
                  ? "text-gold"
                  : "text-muted-foreground hover:text-gold-light"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-gold transition-all duration-300 ${
                  pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gold transition-transform duration-300 active:scale-90"
          aria-label="Toggle menu"
        >
          <div className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        className={`md:hidden bg-dark/98 backdrop-blur-md border-t border-dark-border overflow-hidden transition-all duration-500 ease-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4">
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm font-medium border-b border-dark-border last:border-0 transition-all duration-300 ${
                pathname === link.to ? "text-gold" : "text-muted-foreground"
              }`}
              style={{
                transitionDelay: open ? `${i * 60}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(-12px)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
