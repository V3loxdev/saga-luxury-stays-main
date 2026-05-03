import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import regularImg from "@/assets/regular-room.jpg";
import premiumImg from "@/assets/premium-room.jpg";
import bathroomImg from "@/assets/room-bathroom.jpg";
import amenitiesImg from "@/assets/room-amenities.jpg";
import { Link } from "react-router-dom";
import { Wifi, AirVent, Tv, Bath, ArrowRight, X, Wine, Fence } from "lucide-react";

const rooms = [
  {
    name: "Regular Room",
    price: "₱700 – ₱2,500",
    img: regularImg,
    desc: "A comfortable haven with modern amenities, perfect for solo travelers or couples looking for a relaxing retreat in Pilar, Capiz.",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Cable TV", "Private Bathroom"],
    gallery: [regularImg, bathroomImg],
  },
  {
    name: "Premium Room",
    price: "₱1,400 – ₱4,800",
    img: premiumImg,
    desc: "Our finest accommodation featuring a king-size bed, panoramic ocean views, premium furnishings, and a private balcony overlooking the coast.",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Smart TV", "Luxury Bathroom", "Mini Bar", "Balcony"],
    gallery: [premiumImg, bathroomImg, amenitiesImg],
  },
];

const amenityIcons: Record<string, React.ElementType> = {
  "Free Wi-Fi": Wifi,
  "Air Conditioning": AirVent,
  "Cable TV": Tv,
  "Smart TV": Tv,
  "Private Bathroom": Bath,
  "Luxury Bathroom": Bath,
  "Mini Bar": Wine,
  "Balcony": Fence,
};

export default function RoomsPage() {
  const revealRef = useScrollReveal();
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div ref={revealRef}>
      <section className="section-dark py-32 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2 opacity-0 animate-fade-up">Accommodations</p>
          <h1
            className="font-display text-5xl opacity-0 animate-fade-up"
            style={{ color: "hsl(40, 10%, 90%)", animationDelay: "0.15s" }}
          >
            Our Rooms
          </h1>
          <div className="mx-auto mt-4 h-[2px] bg-gold opacity-0 animate-draw-line" style={{ maxWidth: "80px", animationDelay: "0.4s" }} />
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 space-y-24">
          {rooms.map((room, idx) => (
            <div
              key={room.name}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className={`${idx % 2 === 1 ? "md:order-2" : ""} space-y-3 ${idx % 2 === 0 ? "scroll-reveal-left" : "scroll-reveal-right"}`}>
                <div
                  className="overflow-hidden rounded-xl cursor-pointer card-3d group"
                  onClick={() => setLightbox(room.img)}
                >
                  <img
                    src={room.img}
                    alt={room.name}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {room.gallery.map((g, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-lg cursor-pointer card-3d group"
                      onClick={() => setLightbox(g)}
                    >
                      <img
                        src={g}
                        alt={`${room.name} gallery ${i + 1}`}
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${idx % 2 === 1 ? "md:order-1" : ""} ${idx % 2 === 0 ? "scroll-reveal-right" : "scroll-reveal-left"}`}>
                <h2 className="font-display text-3xl mb-2">{room.name}</h2>
                <p className="text-gold text-2xl font-semibold mb-4">
                  {room.price}
                  <span className="text-base text-muted-foreground font-normal"> / stay</span>
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">{room.desc}</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {room.amenities.map((a) => {
                    const Icon = amenityIcons[a];
                    return (
                      <div key={a} className="flex items-center gap-2 text-sm text-foreground magnetic-hover p-1.5 rounded-md">
                        {Icon ? <Icon size={16} className="text-gold" /> : <span className="w-4 h-4 rounded-full bg-gold/20" />}
                        {a}
                      </div>
                    );
                  })}
                </div>
                <Link to="/booking" className="btn-gold inline-flex items-center gap-2 magnetic-hover group">
                  Book Now <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-dark/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-gold magnetic-hover" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <img
            src={lightbox}
            alt="Room gallery"
            className="max-w-full max-h-[80vh] rounded-xl object-contain animate-scale-in"
          />
        </div>
      )}
    </div>
  );
}
