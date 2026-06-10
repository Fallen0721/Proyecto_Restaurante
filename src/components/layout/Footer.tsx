import React, { useState } from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import Button from "../ui/Button";
import Input from "../ui/Input";

const Footer = React.memo(function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const schedule = [
    { day: "Mar – Jue", hours: "13:00 – 23:00" },
    { day: "Vie – Sáb", hours: "13:00 – 00:00" },
    { day: "Domingo", hours: "13:00 – 22:00" },
    { day: "Lunes", hours: "Cerrado" },
  ];

  return (
    <footer className="relative bg-charcoal-deep border-t border-gold/15">
      {/* Línea decorativa superior */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Columna 1: Logo y descripción */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-display text-2xl text-gold tracking-widest">
                TONY'S MAR
              </h3>
              <p className="font-body text-[10px] text-warmgray/60 tracking-[0.4em] uppercase mt-0.5">
                Alta Cocina Contemporánea
              </p>
            </div>
            <p className="font-body text-sm text-warmgray leading-relaxed">
              Cocina marinera hondureña de raíces garífunas y del Caribe.
              Mariscos frescos, sazón auténtico, alma catracha. Desde 2019.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3 mt-2">
              {[
                {
                  Icon: FaInstagram,
                  href: "https://instagram.com",
                  label: "Instagram",
                },
                {
                  Icon: FaFacebook,
                  href: "https://facebook.com",
                  label: "Facebook",
                },
                {
                  Icon: FaTwitter,
                  href: "https://twitter.com",
                  label: "Twitter/X",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-cursor="expand"
                  className="w-9 h-9 border border-gold/20 flex items-center justify-center text-warmgray hover:text-gold hover:border-gold transition-all duration-300 hover:rotate-[360deg] hover:bg-gold/10"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Horarios */}
          <div>
            <h4 className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-5">
              Horarios
            </h4>
            <div className="flex flex-col gap-3">
              {schedule.map(({ day, hours }) => (
                <div key={day} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 diamond-dot bg-gold/40 flex-shrink-0" />
                  <span className="font-body text-sm text-warmgray flex-1">
                    {day}
                  </span>
                  <span
                    className={[
                      "font-body text-sm",
                      hours === "Cerrado" ? "text-warmgray/40" : "text-cream",
                    ].join(" ")}
                  >
                    {hours}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-charcoal-light">
              <p className="font-body text-xs text-warmgray">
                Av. San Isidro, La Ceiba
              </p>
              <p className="font-body text-xs text-warmgray mt-1">
                +504 2440-1234
              </p>
            </div>
          </div>

          {/* Columna 3: Newsletter */}
          <div>
            <h4 className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-3">
              Newsletter
            </h4>
            <p className="font-body text-sm text-warmgray mb-5 leading-relaxed">
              Recibe nuestras propuestas de temporada, eventos exclusivos y
              experiencias antes de que sean públicos.
            </p>
            {subscribed ? (
              <div className="border border-gold/20 p-4 text-center">
                <p className="font-body text-sm text-gold">✓ ¡Bienvenido/a!</p>
                <p className="font-body text-xs text-warmgray mt-1">
                  Pronto recibirás nuestras novedades.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <Input
                  label="Tu email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="outline" fullWidth>
                  Suscribirse
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-12 pt-6 border-t border-charcoal-light">
          <p className="font-body text-xs text-warmgray/50">
            © {new Date().getFullYear()} TONY'S MAR. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4">
            {["Aviso Legal", "Privacidad", "Cookies"].map((item) => (
              <button
                key={item}
                className="font-body text-xs text-warmgray/50 hover:text-gold transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
