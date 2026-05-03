import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { CalendarDays, Users, CreditCard, CheckCircle, Sparkles, Clock, UtensilsCrossed } from "lucide-react";
import { useBookings, STAY_PRICES, STAY_LABELS, includesMeals, type StayType } from "@/lib/useBookings";

interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  guests: string;
  roomType: string;
  stayType: StayType;
}

import { useRooms } from "@/lib/useRooms";

export default function BookingPage() {
  const { availableRooms } = useRooms();
  const revealRef = useScrollReveal();

  const [step, setStep] = useState<"form" | "summary" | "receipt">("form");
  const [data, setData] = useState<BookingData>({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    guests: "1",
    roomType: "regular",
    stayType: "3hrs",
  });

  const price = STAY_PRICES[data.roomType]?.[data.stayType] ?? 0;
  const total = price;
  const receiptNo = `SH-${Date.now().toString().slice(-8)}`;
  const mealsIncluded = includesMeals(data.stayType);

  const { addBooking } = useBookings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.checkIn) setStep("summary");
  };

  const confirmBooking = () => {
    const newBooking = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      checkIn: data.checkIn,
      checkOut: data.checkIn,
      guests: parseInt(data.guests),
      roomType: data.roomType,
      stayType: data.stayType,
      total,
    };
    addBooking(newBooking);
    setStep("receipt");
  };

  return (
    <div ref={revealRef}>
      <section className="section-dark py-32 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-2 opacity-0 animate-fade-up">Reservations</p>
          <h1 className="font-display text-5xl opacity-0 animate-fade-up" style={{ color: "hsl(40, 10%, 90%)", animationDelay: "0.15s" }}>
            Book Your Stay
          </h1>
          <div className="mx-auto mt-4 h-[2px] bg-gold opacity-0 animate-draw-line" style={{ maxWidth: "80px", animationDelay: "0.4s" }} />
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-2xl">
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-6 scroll-reveal">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={data.fullName}
                  onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300 focus:translate-y-[-1px] focus:shadow-lg focus:shadow-gold/5"
                  placeholder="Juan dela Cruz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300 focus:translate-y-[-1px] focus:shadow-lg focus:shadow-gold/5"
                  placeholder="juan@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300 focus:translate-y-[-1px] focus:shadow-lg focus:shadow-gold/5"
                  placeholder="09123456789"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <CalendarDays size={14} className="inline text-gold mr-1" /> Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={data.checkIn}
                    onChange={(e) => setData({ ...data, checkIn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock size={14} className="inline text-gold mr-1" /> Stay Duration
                  </label>
                  <select
                    value={data.stayType}
                    onChange={(e) => setData({ ...data, stayType: e.target.value as StayType })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300"
                  >
                    <option value="3hrs">3 Hours — ₱700 (Regular) / ₱1,400 (Premium)</option>
                    <option value="12hrs">12 Hours — ₱1,400 (Regular) / ₱2,800 (Premium)</option>
                    <option value="1day">1 Day — ₱2,500 (Regular) / ₱4,800 (Premium)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Users size={14} className="inline text-gold mr-1" /> Guests
                  </label>
                  <select
                    value={data.guests}
                    onChange={(e) => setData({ ...data, guests: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Room Type</label>
                  <select
                    value={data.roomType}
                    onChange={(e) => setData({ ...data, roomType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-300"
                  >
                    <option value="regular">Regular Room</option>
                    <option value="premium">Premium Room</option>
                  </select>
                </div>
              </div>
              {data.checkIn && (
                <div className="bg-secondary/50 rounded-lg p-4 text-sm animate-fade-up space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{STAY_LABELS[data.stayType]} × {data.roomType === "premium" ? "Premium" : "Regular"}</span>
                    <span className="font-semibold text-gold">₱{total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <UtensilsCrossed size={12} className={mealsIncluded ? "text-emerald-400" : "text-muted-foreground"} />
                    <span className={mealsIncluded ? "text-emerald-400" : "text-muted-foreground"}>
                      {mealsIncluded ? "Free meals included (Breakfast, Lunch, Dinner)" : "No free meals included"}
                    </span>
                  </div>
                </div>
              )}
              <button type="submit" className="btn-gold w-full magnetic-hover">
                Review Booking
              </button>
            </form>
          )}

          {step === "summary" && (
            <div className="card-3d bg-card p-8 animate-fade-up">
              <h2 className="font-display text-2xl mb-6">Booking Summary</h2>
              <div className="space-y-4 text-sm">
                {[
                  ["Guest", data.fullName],
                  ["Room", data.roomType === "premium" ? "Premium Room" : "Regular Room"],
                  ["Check-in Date", data.checkIn],
                  ["Stay Duration", STAY_LABELS[data.stayType]],
                  ["Guests", data.guests],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Meals</span>
                  <span className={mealsIncluded ? "font-medium text-emerald-400" : "font-medium text-muted-foreground"}>
                    {mealsIncluded ? "Free meals included" : "No free meals"}
                  </span>
                </div>
                <div className="flex justify-between py-3 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-gold">₱{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-secondary/50 flex items-start gap-3">
                <CreditCard size={18} className="text-gold mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Payment at Cashier</p>
                  <p className="text-muted-foreground">Payment will be processed at the cashier upon arrival.</p>
                  <p className="mt-1 text-gold font-medium">Status: Pending Payment</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep("form")} className="btn-outline-gold flex-1 magnetic-hover">
                  Edit
                </button>
                <button onClick={confirmBooking} className="btn-gold flex-1 magnetic-hover">
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

          {step === "receipt" && (
            <div className="card-3d bg-card p-8 text-center animate-scale-in">
              <div className="relative inline-block mb-4">
                <CheckCircle size={48} className="text-gold" />
                <Sparkles size={16} className="text-gold absolute -top-1 -right-2 animate-float" />
              </div>
              <h2 className="font-display text-2xl mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground text-sm mb-8">Your reservation has been placed.</p>

              <div className="bg-secondary/30 rounded-lg p-6 text-left space-y-3 text-sm">
                <div className="text-center mb-4">
                  <p className="font-display text-lg gold-shimmer">SAGA HOTEL</p>
                  <p className="text-xs text-muted-foreground">Pilar, Capiz, Philippines</p>
                </div>
                <div className="border-t border-dashed border-border pt-4 space-y-2">
                  {[
                    ["Receipt #", receiptNo],
                    ["Guest", data.fullName],
                    ["Room", data.roomType === "premium" ? "Premium Room" : "Regular Room"],
                    ["Check-in Date", data.checkIn],
                    ["Stay Duration", STAY_LABELS[data.stayType]],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-muted-foreground">{l}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meals</span>
                    <span className={mealsIncluded ? "text-emerald-400" : "text-muted-foreground"}>
                      {mealsIncluded ? "Free meals included" : "No free meals"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-dashed border-border pt-4 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-gold">₱{total.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed border-border pt-4 text-center">
                  <p className="text-gold font-medium">Pay at Cashier</p>
                  <p className="text-xs text-muted-foreground mt-1">Present this receipt upon arrival</p>
                </div>
              </div>

              <button
                onClick={() => { setStep("form"); setData({ fullName: "", email: "", phone: "", checkIn: "", guests: "1", roomType: "regular", stayType: "3hrs" }); }}
                className="btn-gold mt-8 magnetic-hover"
              >
                Make Another Booking
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
