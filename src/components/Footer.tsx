import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="section-dark border-t border-dark-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-2xl gold-text mb-4">SAGA HOTEL</h3>
            <p className="text-sm leading-relaxed opacity-70">
              Experience luxury and comfort in the heart of Pilar, Capiz.
              Your perfect island getaway awaits.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-gold-light">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Rooms", "Booking", "Promos", "About", "Contact"].map((l) => (
                <Link
                  key={l}
                  to={`/${l.toLowerCase()}`}
                  className="text-sm opacity-70 hover:opacity-100 hover:text-gold transition-all duration-300"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-gold-light">Contact</h4>
            <div className="flex flex-col gap-3 text-sm opacity-70">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-gold shrink-0" />
                Pilar, Capiz, Philippines
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-gold shrink-0" />
                +63 912 345 6789
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-gold shrink-0" />
                info@sagahotel.ph
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
          <span>© {new Date().getFullYear()} Saga Hotel. All rights reserved.</span>
          <Link to="/admin" className="opacity-70 hover:opacity-100 hover:text-gold transition-all duration-300">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
