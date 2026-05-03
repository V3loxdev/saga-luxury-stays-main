import React, { useState, useEffect } from "react";
import { Eye, Trash2, X, CheckCircle, Clock, UtensilsCrossed, Timer } from "lucide-react";
import { useBookings, STAY_LABELS, includesMeals, getBookingTimer } from "@/lib/useBookings";
import { useRooms } from "@/lib/useRooms";

const mockBookings = [];

export default function AdminBookings() {
  const { bookings, tick, updateStatus, deleteBooking, expireBooking } = useBookings();
  const { rooms, occupyRoom, vacateRoom } = useRooms();
  const [selected, setSelected] = useState(null);

  // Auto-expire confirmed bookings when their timer reaches 0
  useEffect(() => {
    bookings.forEach(b => {
      if (b.status === 'Confirmed' && b.confirmedAt) {
        const timer = getBookingTimer(b);
        if (timer.isExpired) {
          expireBooking(b.id);
          if (b.assignedRoom) {
            vacateRoom(b.assignedRoom);
          }
        }
      }
    });
  }, [tick, bookings, expireBooking, vacateRoom]);

  const getStatusBadge = (status: string) => {
    if (status === "Confirmed") {
      return "bg-emerald-500/10 text-emerald-400";
    }
    if (status === "Expired") {
      return "bg-red-500/10 text-red-400";
    }
    return "bg-amber-500/10 text-amber-400";
  };

  return (
    <div>
      <h1 className="font-display text-3xl gold-text mb-8">Booking Records</h1>

      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                {["Customer", "Room Type", "Check-in", "Duration", "Timer", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const timer = getBookingTimer(b);
                return (
                  <tr key={b.id} className="border-b border-dark-border/50 last:border-0 hover:bg-gold/5 transition-colors">
                    <td className="py-3" style={{ color: "hsl(40, 10%, 85%)" }}>{b.fullName}</td>
                    <td className="py-3 text-muted-foreground">{b.roomType}</td>
                    <td className="py-3 text-muted-foreground">{b.checkIn}</td>
                    <td className="py-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-gold" />
                        {STAY_LABELS[b.stayType] || b.stayType}
                      </span>
                    </td>
                    <td className="py-3">
                      {b.status === 'Confirmed' ? (
                        <span className={`flex items-center gap-1 font-mono text-xs ${timer.isExpired ? 'text-red-400' : 'text-gold'}`}>
                          <Timer size={12} />
                          {timer.formatted}
                        </span>
                      ) : b.status === 'Expired' ? (
                        <span className="text-red-400 text-xs">—</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelected(b)} className="p-1.5 rounded-lg hover:bg-gold/10 text-gold/60 hover:text-gold transition-colors" title="View details" aria-label="View booking details">
                          <Eye size={14} />
                        </button>
                        {b.status === 'Pending' && (
                          <button 
                            onClick={() => {
                              if (confirm('Confirm this booking? Assign available room.')) {
                                const availableRooms = rooms.filter(r => r.status === 'Available' && r.type.toLowerCase() === b.roomType.toLowerCase());
                                if (availableRooms.length > 0) {
                                  const assigned = availableRooms[0].name;
                                  occupyRoom(assigned, b.roomType);
                                  updateStatus(b.id, 'Confirmed', assigned);
                                } else {
                                  alert('No available rooms of this type!');
                                }
                              }
                            }} 
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-400 transition-colors" 
                            title="Approve booking" aria-label="Approve booking"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (confirm('Delete this booking?')) {
                              if (b.assignedRoom) {
                                vacateRoom(b.assignedRoom);
                              }
                              deleteBooking(b.id);
                            }
                          }} 
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors" 
                          title="Delete booking" aria-label="Delete booking"
                        >
                          <Trash2 size={14} />
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

      {selected && (
        <div className="fixed inset-0 z-50 bg-dark/80 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="admin-card max-w-md w-full relative p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gold/60 hover:text-gold p-1 rounded" title="Close" aria-label="Close modal">
              <X size={18} />
            </button>
            <h2 className="font-display text-xl gold-text mb-4">Booking Details</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Customer", selected.fullName],
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
                  <span className="font-mono text-gold">
                    {getBookingTimer(selected).formatted}
                  </span>
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

