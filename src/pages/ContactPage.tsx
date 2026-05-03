import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <section className="section-dark py-32 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2 opacity-0 animate-fade-up">Get in Touch</p>
          <h1 className="font-display text-5xl opacity-0 animate-fade-up" style={{ color: "hsl(40, 10%, 90%)", animationDelay: "0.15s" }}>
            Contact Us
          </h1>
          <div className="mx-auto mt-4 h-[2px] bg-gold opacity-0 animate-draw-line" style={{ maxWidth: "80px", animationDelay: "0.4s" }} />
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="scroll-reveal-left">
              <h2 className="font-display text-2xl mb-6">Send a Message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300 focus:translate-y-[-1px] focus:shadow-lg focus:shadow-gold/5"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300 focus:translate-y-[-1px] focus:shadow-lg focus:shadow-gold/5"
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300 resize-none focus:translate-y-[-1px] focus:shadow-lg focus:shadow-gold/5"
                />
                <button type="submit" className="btn-gold w-full magnetic-hover">Send Message</button>
              </form>
            </div>

            <div className="scroll-reveal-right space-y-4">
              <h2 className="font-display text-2xl mb-6">Hotel Information</h2>
              {[
                { icon: MapPin, label: "Address", value: "Pilar, Capiz, Philippines 5804" },
                { icon: Phone, label: "Phone", value: "+63 912 345 6789" },
                { icon: Mail, label: "Email", value: "info@sagahotel.ph" },
                { icon: Clock, label: "Front Desk", value: "Open 24/7" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border magnetic-hover"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
