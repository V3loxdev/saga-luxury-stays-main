import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";

const promos = [
  {
    title: "Premium Room Discount",
    desc: "Get 20% off on Premium Room bookings this season. Experience luxury at an unbeatable price.",
    discount: "20% OFF",
    badge: "LIMITED OFFER",
  },
  {
    title: "Stay 3 Nights, Get 1 Free",
    desc: "Book 3 consecutive nights and enjoy an extra night on us. Valid for both Regular and Premium rooms.",
    discount: "3+1 FREE",
    badge: "LIMITED OFFER",
  },
];

export default function PromosPage() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <section className="section-dark py-32 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2 opacity-0 animate-fade-up">Special Offers</p>
          <h1 className="font-display text-5xl opacity-0 animate-fade-up" style={{ color: "hsl(40, 10%, 90%)", animationDelay: "0.15s" }}>
            Promo Deals
          </h1>
          <div className="mx-auto mt-4 h-[2px] bg-gold opacity-0 animate-draw-line" style={{ maxWidth: "80px", animationDelay: "0.4s" }} />
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl space-y-8">
          {promos.map((p, i) => (
            <div
              key={p.title}
              className={`card-3d bg-card overflow-hidden ${i === 0 ? "scroll-reveal-left" : "scroll-reveal-right"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="p-8 flex flex-col md:flex-row items-start gap-6">
                <div className="shrink-0 w-24 h-24 rounded-xl bg-dark flex items-center justify-center animate-pulse-glow relative">
                  <span className="font-display text-xl gold-shimmer text-center leading-tight">{p.discount}</span>
                  <Flame size={14} className="text-gold absolute -top-1 -right-1 animate-float" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-display text-xl">{p.title}</h3>
                    <span className="badge-limited">{p.badge}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.desc}</p>
                  <Link to="/booking" className="inline-flex items-center gap-2 text-gold text-sm font-medium group">
                    Book Now <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
