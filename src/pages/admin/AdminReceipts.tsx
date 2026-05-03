import { useBookings, STAY_LABELS, includesMeals, getBookingTimer } from "@/lib/useBookings";
import { Download, Printer, Eye, Clock, UtensilsCrossed, Timer, X } from "lucide-react";
import { useState } from "react";

export default function AdminReceipts() {
  const { bookings, tick } = useBookings();
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Expired');
  const [selected, setSelected] = useState(null);

  const printReceipt = (booking: any) => {
    const timer = getBookingTimer(booking);
    const mealsText = includesMeals(booking.stayType) ? "Free meals included (Breakfast, Lunch, Dinner)" : "No free meals included";
    const receipt = `
SAGA HOTEL RECEIPT
==================
Guest: ${booking.fullName}
Email: ${booking.email}
Phone: ${booking.phone}
Room Type: ${booking.roomType}
Assigned Room: ${booking.assignedRoom || 'Not assigned'}
Check-in Date: ${booking.checkIn}
Stay Duration: ${STAY_LABELS[booking.stayType] || booking.stayType}
Time Remaining: ${timer.formatted}
Guests: ${booking.guests}
Meals: ${mealsText}
Total: ₱${booking.total.toLocaleString()}

Thank you for staying with us!
Pilar, Capiz
    `;
    const win = window.open('', '_blank');
    win?.document.write(`<pre style="font-family: monospace; padding: 20px; margin: 0;">${receipt}</pre>`);
    win?.document.close();
  };

  return (
    <div>
      <h1 className="font-display text-3xl gold-text mb-8">Receipts</h1>

      {confirmedBookings.length === 0 ? (
        <div className="admin-card text-center py-16">
          <p className="text-muted-foreground mb-4">No confirmed bookings with receipts yet.</p>
          <p className="text-xs text-muted-foreground/70">Approve bookings to generate receipts.</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 text-muted-foreground font-medium">Guest</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Check-in</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Duration</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Time Left</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 text-muted-foreground font-medium w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedBookings.map((b) => {
                  const timer = getBookingTimer(b);
                  return (
                    <tr key={b.id} className="border-b border-dark-border/50 hover:bg-gold/5">
                      <td className="py-3" style={{ color: "hsl(40, 10%, 85%)" }}>{b.fullName}</td>
                      <td className="py-3 text-muted-foreground">{b.checkIn}</td>
                      <td className="py-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-gold" />
                          {STAY_LABELS[b.stayType] || b.stayType}
                        </span>
                      </td>
                      <td className="py-3">
                        {b.status === 'Expired' ? (
                          <span className="text-red-400 text-xs font-medium">Expired</span>
                        ) : (
                          <span className={`flex items-center gap-1 font-mono text-xs ${timer.isExpired ? 'text-red-400' : 'text-gold'}`}>
                            <Timer size={12} />
                            {timer.formatted}
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-semibold text-gold">₱{b.total.toLocaleString()}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelected(b)}
                            className="p-1.5 rounded-lg hover:bg-gold/10 text-gold hover:text-gold transition-all"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => printReceipt(b)}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-400 transition-all"
                            title="Print Receipt"
                          >
                            <Printer size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              const timer = getBookingTimer(b);
                              const details = `
SAGA HOTEL RECEIPT #${b.id}
Date: ${new Date().toLocaleDateString()}
Guest: ${b.fullName}
Room: ${b.roomType}
Assigned Room: ${b.assignedRoom || 'Not assigned'}
Check-in Date: ${b.checkIn}
Stay Duration: ${STAY_LABELS[b.stayType] || b.stayType}
Time Remaining: ${timer.formatted}
Meals: ${includesMeals(b.stayType) ? "Free meals included" : "No free meals"}
Total: ₱${b.total.toLocaleString()}
                              `;
                              navigator.clipboard.writeText(details);
                              alert('Receipt copied to clipboard!');
                            }}
                            className="p-1.5 rounded-lg hover:bg-gold/10 text-gold hover:text-gold transition-all"
                            title="Copy Details"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-dark/80 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="admin-card max-w-md w-full relative p-6" onClick={(e) => e.stopPropagation()}>
<button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gold/60 hover:text-gold p-1 rounded" title="Close" aria-label="Close modal"><X size={18} /></button>
            <h2 className="font-display text-xl gold-text mb-4">Receipt Preview</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Guest", selected.fullName],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Room Type", selected.roomType],
                ["Assigned Room", selected.assignedRoom || "Not assigned"],
                ["Check-in Date", selected.checkIn],
                ["Stay Duration", STAY_LABELS[selected.stayType] || selected.stayType],
                ["Guests", String(selected.guests)],
                ["Total", `₱${selected.total?.toLocaleString() || 0}`],
                ["Status", selected.status],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <span className="text-muted-foreground">{l}</span>
                  <span style={{ color: "hsl(40, 10%, 85%)" }}>{v}</span>
                </div>
              ))}
              {selected.status === 'Confirmed' && (
                <div className="flex justify-between py-2 border-b border-dark-border/50">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span className="font-mono text-gold">{getBookingTimer(selected).formatted}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-dark-border/50">
                <span className="text-muted-foreground">Meals</span>
                <span className={includesMeals(selected.stayType) ? "text-emerald-400" : "text-muted-foreground"}>
                  {includesMeals(selected.stayType) ? "Free meals included" : "No free meals"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

