import { useBookings } from "@/lib/useBookings";
import { useRooms } from "@/lib/useRooms";
import { CalendarDays, CreditCard, TrendingUp, Bed } from "lucide-react";

export default function AdminDashboard() {
  const { bookings } = useBookings();
  const { rooms } = useRooms();

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const expiredBookings = bookings.filter(b => b.status === 'Expired').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const totalRooms = rooms.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const recentBookings = bookings.slice(-5).reverse();
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const occupancyWidthClass = [
    'w-0',
    'w-1/12',
    'w-2/12',
    'w-3/12',
    'w-4/12',
    'w-5/12',
    'w-6/12',
    'w-7/12',
    'w-8/12',
    'w-9/12',
    'w-10/12',
    'w-11/12',
    'w-full',
  ][Math.min(12, Math.max(0, Math.round(occupancyRate / 8)))];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.32em] text-gold/80">Admin dashboard</p>
          <h1 className="font-display text-4xl md:text-5xl text-white">Property performance overview</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Monitor occupancy, revenue, and booking activity from a single, polished dashboard built for luxury hospitality.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-3xl border border-dark-border/80 bg-dark-card/90 px-4 py-3 text-sm text-muted-foreground">
          <CalendarDays size={18} className="text-gold" />
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shadow-sm shadow-gold/10">
              <CalendarDays size={20} />
            </div>
            <span className="text-xs uppercase tracking-[0.24em] text-gold/70">+12% vs last week</span>
          </div>
          <p className="text-4xl font-semibold text-white">{totalBookings}</p>
          <p className="text-sm text-muted-foreground mt-2">Total bookings</p>
        </div>
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-300 flex items-center justify-center shadow-sm shadow-amber-400/10">
              <CreditCard size={20} />
            </div>
            <span className="text-xs uppercase tracking-[0.24em] text-amber-200/80">{pendingBookings} awaiting</span>
          </div>
          <p className="text-4xl font-semibold text-amber-200">{pendingBookings}</p>
          <p className="text-sm text-muted-foreground mt-2">Pending approvals</p>
        </div>
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-300 flex items-center justify-center shadow-sm shadow-emerald-400/10">
              <Bed size={20} />
            </div>
            <span className="text-xs uppercase tracking-[0.24em] text-emerald-300/80">{Math.round((occupiedRooms / Math.max(totalRooms, 1)) * 100)}%</span>
          </div>
          <p className="text-4xl font-semibold text-emerald-300">{occupiedRooms}/{totalRooms}</p>
          <p className="text-sm text-muted-foreground mt-2">Rooms occupied</p>
        </div>
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shadow-sm shadow-gold/10">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs uppercase tracking-[0.24em] text-gold/70">Revenue</span>
          </div>
          <p className="text-4xl font-semibold text-gold">₱{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Total revenue</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="admin-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Latest reservations</p>
              <h2 className="text-2xl font-semibold text-white">Recent bookings</h2>
            </div>
            <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gold">
              Last 5 entries
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-dark-border/50">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-dark-card/80">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-[0.18em] text-[0.72rem] text-muted-foreground">Guest</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em] text-[0.72rem] text-muted-foreground">Room</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em] text-[0.72rem] text-muted-foreground">Check-in</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em] text-[0.72rem] text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-t border-dark-border/30 hover:bg-gold/5 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-semibold text-white">{b.fullName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{b.roomType}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{b.checkIn}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${
                        b.status === "Confirmed"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          : b.status === "Expired"
                          ? "bg-red-500/10 text-red-300 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground">
                      No bookings yet. Make a test booking from the public site.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Performance summary</p>
              <h2 className="text-2xl font-semibold text-white">Operational insights</h2>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Live data
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-dark-border/50 bg-dark-card/80 p-5">
              <p className="text-sm text-muted-foreground uppercase tracking-[0.18em] mb-3">Confirmed today</p>
              <p className="text-3xl font-semibold text-white">{confirmedBookings}</p>
              <p className="mt-2 text-sm text-muted-foreground">Bookings approved and ready for arrival.</p>
            </div>

            <div className="rounded-3xl border border-dark-border/50 bg-dark-card/80 p-5">
              <p className="text-sm text-muted-foreground uppercase tracking-[0.18em] mb-3">Average stay value</p>
              <p className="text-3xl font-semibold text-white">₱{(totalRevenue / Math.max(totalBookings, 1)).toLocaleString()}</p>
              <p className="mt-2 text-sm text-muted-foreground">Average revenue per booking.</p>
            </div>

            <div className="rounded-3xl border border-dark-border/50 bg-dark-card/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-[0.18em]">Occupancy rate</p>
                  <p className="text-2xl font-semibold text-white">{totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0}%</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300">
                  {occupiedRooms}/{totalRooms}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 ${occupancyWidthClass}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

