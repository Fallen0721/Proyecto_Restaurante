import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "#inicio", label: "Inicio" },
  { href: "#mission-vision", label: "Nosotros" },
  { href: "#menu", label: "Carta" },
  { href: "#delivery", label: "Delivery" },
  { href: "#galeria", label: "Galería" },
  { href: "#reservacion", label: "Contacto" },
];

const Navbar = React.memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  // Efecto scroll para cambiar fondo
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animación del menú mobile
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
      gsap.from(mobileMenuRef.current.querySelectorAll(".mobile-link"), {
        opacity: 0,
        x: -20,
        stagger: 0.08,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.1,
      });
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    scrollTo(href);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-charcoal-deep/85 backdrop-blur-xl border-b border-gold/10 py-3"
            : "bg-transparent py-5",
        ].join(" ")}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#inicio")}
            data-cursor="expand"
            className="flex flex-col items-start"
            aria-label="Ir al inicio"
          >
            <span className="font-display text-lg md:text-xl text-gold leading-none tracking-widest">
              TONY'S MAR
            </span>
            <span className="font-body text-[9px] text-warmgray/70 tracking-[0.35em] uppercase">
              Alta Cocina
            </span>
          </button>

          {/* Links desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href === "#reservacion" ? null : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  data-cursor="expand"
                  className="nav-link font-body text-sm text-warmgray hover:text-cream transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </button>
              ),
            )}
          </div>

          {/* CTA desktop */}
          <div className="hidden lg:block">
            <button
              onClick={() => handleNavClick("#reservacion")}
              data-cursor="expand"
              className="font-body text-sm text-charcoal-deep bg-gold hover:bg-gold-dark px-5 py-2.5 tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,165,116,0.3)]"
            >
              Reservar
            </button>
          </div>

          {/* Hamburguesa mobile */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="lg:hidden flex flex-col gap-1.5 w-6 h-5 justify-center"
          >
            <span
              className={[
                "w-full h-px bg-cream transition-all duration-300",
                mobileOpen ? "rotate-45 translate-y-[4px]" : "",
              ].join(" ")}
            />
            <span
              className={[
                "w-4 h-px bg-cream transition-all duration-300",
                mobileOpen ? "opacity-0 translate-x-2" : "",
              ].join(" ")}
            />
            <span
              className={[
                "w-full h-px bg-cream transition-all duration-300",
                mobileOpen ? "-rotate-45 -translate-y-[10px]" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </nav>

      {/* Menú mobile fullscreen */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-charcoal-deep/97 backdrop-blur-xl flex flex-col items-center justify-center gap-8 lg:hidden"
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={[
                "mobile-link font-display text-3xl transition-colors duration-200",
                link.href === "#reservacion"
                  ? "text-gold hover:text-gold-light"
                  : "text-cream hover:text-gold",
              ].join(" ")}
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <span className="w-8 h-px bg-gold/40" />
            <span className="font-body text-xs text-warmgray/60 tracking-widest uppercase">
              Madrid, España
            </span>
            <span className="w-8 h-px bg-gold/40" />
          </div>
        </div>
      )}
    </>
  );
});

export default Navbar;
