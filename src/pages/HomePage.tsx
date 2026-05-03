import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Link } from "react-router-dom";
import { Coffee, UtensilsCrossed, Soup, Star, ArrowRight, Sparkles } from "lucide-react";
import { useSnacksDrinks } from "@/lib/useSnacksDrinks";
import AnimatedCounter from "@/components/AnimatedCounter";
import heroImg from "@/assets/hero-hotel.jpg";
import regularImg from "@/assets/regular-room.jpg";
import premiumImg from "@/assets/premium-room.jpg";

export default function HomePage() {
  const revealRef = useScrollReveal();
  const { availableItems: getAvailableItems } = useSnacksDrinks();

  return (
    <div ref={revealRef}>
      {/* Hero — Ken Burns + layered entrance */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Saga Hotel aerial view"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative container mx-auto px-6">
          <div className="max-w-xl">
            <p
              className="text-sm font-medium tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-up"
              style={{ color: "hsl(40, 60%, 50%)", animationDelay: "0.2s" }}
            >
              Pilar, Capiz · Philippines
            </p>
            <h1
              className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6 opacity-0 animate-fade-up"
              style={{ color: "white", animationDelay: "0.4s" }}
            >
              <span className="gold-shimmer">Saga</span> Hotel
            </h1>
            <p
              className="text-lg leading-relaxed mb-8 opacity-0 animate-fade-up"
              style={{ color: "hsl(40 10% 85%)", animationDelay: "0.6s" }}
            >
              Discover serene luxury on the shores of Capiz.
              Where every stay tells a story.
            </p>
            <div className="flex gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "0.8s" }}>
              <Link to="/booking" className="btn-gold magnetic-hover">
                Book Now
              </Link>
              <Link
                to="/rooms"
                className="btn-outline-gold magnetic-hover"
                style={{ borderColor: "hsl(40, 60%, 50%)", color: "hsl(40, 60%, 50%)" }}
              >
                View Rooms
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative floating sparkle */}
        <div className="absolute top-1/4 right-[15%] hidden md:block animate-float opacity-20">
          <Sparkles size={32} className="text-gold" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-dark py-12 border-y border-dark-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 500, suffix: "+", label: "Happy Guests" },
              { value: 2, suffix: "", label: "Room Types" },
              { value: 3, suffix: "", label: "Stay Durations" },
              { value: 24, suffix: "/7", label: "Front Desk" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="scroll-reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <p className="font-display text-3xl md:text-4xl text-gold mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2">
              Accommodations
            </p>
            <h2 className="font-display text-4xl">Our Rooms</h2>
            <div className="mx-auto mt-4 h-[2px] w-0 bg-gold animate-draw-line scroll-reveal" style={{ maxWidth: "80px" }} />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Regular Room",
                price: "₱700 – ₱2,500",
                img: regularImg,
                desc: "Comfortable and cozy, perfect for travelers seeking a restful stay with all essential amenities.",
              },
              {
                name: "Premium Room",
                price: "₱1,400 – ₱4,800",
                img: premiumImg,
                desc: "Spacious luxury suite with panoramic views, premium furnishings, and exclusive amenities.",
              },
            ].map((room, i) => (
              <div
                key={room.name}
                className={`card-3d overflow-hidden bg-card ${i === 0 ? "scroll-reveal-left" : "scroll-reveal-right"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="aspect-[16/10] overflow-hidden relative group">
                  <img
                    src={room.img}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-xl">{room.name}</h3>
                    <span className="text-gold font-semibold">{room.price}<span className="text-xs text-muted-foreground font-normal"> / stay</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{room.desc}</p>
                  <Link to="/booking" className="inline-flex items-center gap-2 text-gold text-sm font-medium group/link">
                    Book This Room
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Food */}
      <section className="section-dark py-24 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="scroll-reveal">
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2">
              Complimentary
            </p>
            <h2 className="font-display text-4xl mb-4" style={{ color: "hsl(40, 10%, 90%)" }}>Free Meals Included</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-12">
              1 Day bookings include complimentary breakfast, lunch, and dinner during your stay.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { icon: Coffee, label: "Breakfast", delay: 0 },
              { icon: UtensilsCrossed, label: "Lunch", delay: 1 },
              { icon: Soup, label: "Dinner", delay: 2 },
            ].map((meal) => (
              <div
                key={meal.label}
                className="flex flex-col items-center gap-3 scroll-reveal-scale"
                style={{ transitionDelay: `${meal.delay * 150}ms` }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border border-gold/30 bg-gold/5 animate-pulse-glow magnetic-hover"
                  style={{ animationDelay: `${meal.delay * 0.5}s` }}
                >
                  <meal.icon size={24} className="text-gold" />
                </div>
                <span className="text-sm font-medium" style={{ color: "hsl(40, 10%, 80%)" }}>{meal.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-8 max-w-md mx-auto">
            *Free meals are exclusively included with 1 Day bookings. 3 Hour and 12 Hour stays do not include complimentary meals.
          </p>
        </div>
      </section>

      {/* Promos teaser */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="scroll-reveal">
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2">
              Special Offers
            </p>
            <h2 className="font-display text-4xl mb-4">Exclusive Deals</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Take advantage of our limited-time offers and make your stay even more memorable.
            </p>
            <Link to="/foods" className="btn-gold inline-flex items-center gap-2 magnetic-hover group">
              Foods & Drinks
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-dark py-24 overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-2xl scroll-reveal-scale">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={18}
                className="text-gold fill-gold animate-scale-in"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              />
            ))}
          </div>
          <blockquote className="font-display text-2xl italic leading-relaxed mb-6" style={{ color: "hsl(40, 10%, 85%)" }}>
            "The most serene hotel experience in the Visayas. The staff, the food, the rooms — everything was beyond our expectations."
          </blockquote>
          <p className="text-sm text-muted-foreground">— Maria Santos, Manila</p>
        </div>
      </section>
    </div>
  );
}
