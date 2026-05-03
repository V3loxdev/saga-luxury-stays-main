import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import pilarImg from "@/assets/pilar-capiz.jpg";
import { MapPin, Palmtree, Shell, Waves } from "lucide-react";

export default function AboutPage() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <section className="section-dark py-32 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2 opacity-0 animate-fade-up">Our Story</p>
          <h1 className="font-display text-5xl opacity-0 animate-fade-up" style={{ color: "hsl(40, 10%, 90%)", animationDelay: "0.15s" }}>
            About Saga Hotel
          </h1>
          <div className="mx-auto mt-4 h-[2px] bg-gold opacity-0 animate-draw-line" style={{ maxWidth: "80px", animationDelay: "0.4s" }} />
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal-left">
              <div className="overflow-hidden rounded-xl card-3d">
                <img
                  src={pilarImg}
                  alt="Pilar, Capiz coastline"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            <div className="scroll-reveal-right">
              <h2 className="font-display text-3xl mb-4">Pilar, Capiz</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nestled in the coastal municipality of Pilar in the province of Capiz, Saga Hotel offers a peaceful escape from the bustle of city life. Capiz, known as the Seafood Capital of the Philippines, is famous for its pristine beaches, rich marine life, and warm-hearted locals.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Saga Hotel was founded with a simple vision: to provide world-class hospitality in one of the Philippines' most beautiful yet undiscovered destinations. Every room, every meal, and every experience is crafted with care.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: "Pilar, Capiz" },
                  { icon: Palmtree, label: "Tropical Paradise" },
                  { icon: Shell, label: "Seafood Capital" },
                  { icon: Waves, label: "Crystal Waters" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-sm magnetic-hover p-2 rounded-md"
                  >
                    <item.icon size={16} className="text-gold" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
