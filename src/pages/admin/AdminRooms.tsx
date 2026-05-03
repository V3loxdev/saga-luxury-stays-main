import { useState, useEffect } from "react";
import { useRooms, ROOM_DURATION_OPTIONS, getRoomRemainingTime, formatRoomTime } from "@/lib/useRooms";
import { Plus, Edit3, Trash2, Bed, ShieldAlert, ChevronRight, ChevronLeft, Timer, Clock, X } from "lucide-react";

type RoomType = "Regular" | "Premium";
type RoomStatus = "Available" | "Occupied";

type Room = {
  name: string;
  type: RoomType;
  status: RoomStatus;
  floor: string;
  occupiedAt?: number;
  durationMs?: number;
};

type RoomForm = {
  name: string;
  type: RoomType;
  floor: string;
};

export default function AdminRooms() {
  const { rooms, tick, addRoom, updateRoom, deleteRoom, occupyRoomWithTimer, vacateRoom } = useRooms();
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState<RoomForm>({ name: "", type: "Regular", floor: "1st" });
  const [editingRoom, setEditingRoom] = useState<string>("");
  const [editForm, setEditForm] = useState<RoomForm>({ name: "", type: "Regular", floor: "1st" });

  // Duration selection dialog state
  const [occupyingRoom, setOccupyingRoom] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(ROOM_DURATION_OPTIONS[0].value);

  const available = rooms.filter((room) => room.status === "Available").length;
  const occupied = rooms.filter((room) => room.status === "Occupied").length;
  const totalRooms = rooms.length;

  const handleLocalAddRoom = () => {
    if (!newRoom.name.trim()) return;

    const newR = {
      name: newRoom.name.trim(),
      type: newRoom.type,
      floor: newRoom.floor,
    };

    addRoom(newR);
    setNewRoom({ name: "", type: "Regular", floor: "1st" });
    setShowForm(false);
  };

  const handleToggleRoom = (room: Room) => {
    if (room.status === "Available") {
      // Show duration selection dialog
      setOccupyingRoom(room.name);
      setSelectedDuration(ROOM_DURATION_OPTIONS[0].value);
    } else {
      // Directly vacate
      if (confirm("Vacate this room? The timer will be cleared.")) {
        vacateRoom(room.name);
      }
    }
  };

  const confirmOccupy = () => {
    if (occupyingRoom && selectedDuration) {
      occupyRoomWithTimer(occupyingRoom, selectedDuration);
      setOccupyingRoom(null);
    }
  };

  const startEdit = (room: Room) => {
    setEditingRoom(room.name);
    setEditForm({ name: room.name, type: room.type, floor: room.floor });
    setShowForm(false);
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;

    updateRoom(editingRoom, {
      name: editForm.name.trim(),
      type: editForm.type,
      floor: editForm.floor
    });
    setEditingRoom("");
  };

  const handleDeleteRoom = (name: string) => {
    if (!confirm("Delete this room?")) return;
    deleteRoom(name);
  };

  const getRoomTimerDisplay = (room: Room) => {
    if (room.status !== "Occupied" || !room.occupiedAt || !room.durationMs) return null;
    const remaining = getRoomRemainingTime(room);
    if (remaining <= 0) return "Expired";
    return formatRoomTime(remaining);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.28em] text-gold/70">Room operations</p>
          <div className="space-y-2">
            <h1 className="font-display text-4xl text-white">Room management</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">Keep room inventory updated, manage occupancy status, and add new offerings effortlessly.</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-dark shadow-lg shadow-gold/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus size={18} />
          Add room
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300 shadow-sm shadow-emerald-400/10">
              <Bed className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Available rooms</p>
              <p className="text-3xl font-semibold text-white">{available}</p>
            </div>
          </div>
        </div>

        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-300 shadow-sm shadow-orange-400/10">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Occupied rooms</p>
              <p className="text-3xl font-semibold text-white">{occupied}</p>
            </div>
          </div>
        </div>

        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gold/10 text-gold shadow-sm shadow-gold/10">
              <div className="text-lg font-semibold">{totalRooms}</div>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Total rooms</p>
              <p className="text-3xl font-semibold text-white">{totalRooms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Duration Selection Dialog */}
      {occupyingRoom && (
        <div className="fixed inset-0 z-50 bg-dark/80 flex items-center justify-center p-6">
          <div className="admin-card max-w-md w-full relative p-8">
            <button 
              onClick={() => setOccupyingRoom(null)} 
              className="absolute top-4 right-4 text-gold/60 hover:text-gold p-1 rounded"
              title="Close"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center">
                <Timer size={20} className="text-gold" />
              </div>
              <div>
                <h2 className="font-display text-xl gold-text">Occupy Room</h2>
                <p className="text-sm text-muted-foreground">Select duration for {occupyingRoom}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {ROOM_DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDuration(option.value)}
                  className={`w-full flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                    selectedDuration === option.value
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-dark-border bg-background/5 text-white hover:border-gold/40 hover:bg-gold/5"
                  }`}
                >
                  <Clock size={18} className={selectedDuration === option.value ? "text-gold" : "text-muted-foreground"} />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">Room will auto-release after {option.label.toLowerCase()}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOccupyingRoom(null)}
                className="flex-1 rounded-3xl border border-dark-border px-6 py-3 text-sm text-muted-foreground transition hover:border-gold hover:text-gold"
              >
                Cancel
              </button>
              <button
                onClick={confirmOccupy}
                className="flex-1 rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Occupy Room
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="admin-card border border-gold/20 bg-dark-card/95 p-8 shadow-2xl shadow-gold/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-white">Add new room</h3>
              <p className="text-sm text-muted-foreground">Create a luxury room entry with type and floor details.</p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-full border border-muted-foreground/20 px-4 py-2 text-sm text-muted-foreground transition hover:border-gold/40 hover:text-gold"
            >
              Close
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              placeholder="Room Name e.g. Premium Suite 401"
              aria-label="Room name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            />
            <select
              title="Room type"
              aria-label="Room type"
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as RoomType })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            >
              <option value="Regular">Regular Room</option>
              <option value="Premium">Premium Suite</option>
            </select>
            <select
              title="Floor"
              aria-label="Floor"
              value={newRoom.floor}
              onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            >
              <option value="1st">1st Floor</option>
              <option value="2nd">2nd Floor</option>
              <option value="3rd">3rd Floor</option>
              <option value="4th">4th Floor</option>
            </select>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-3xl border border-dark-border px-6 py-3 text-sm text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              Cancel
            </button>
            <button
              onClick={handleLocalAddRoom}
              disabled={!newRoom.name.trim()}
              className="rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add room
            </button>
          </div>
        </div>
      )}

      <div className="admin-card p-1 bg-dark-card/80 border border-dark-border/60 shadow-2xl">
        <div className="overflow-hidden rounded-[2rem] bg-background/5">
          <div className="flex flex-col gap-4 border-b border-dark-border/50 bg-dark-card/80 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Room inventory</h2>
              <p className="text-sm text-muted-foreground">Manage room status and properties in one place.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm text-gold">
              <span className="font-medium">{totalRooms}</span>
              rooms
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-dark-card/90 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Room</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Type</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Floor</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Status</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      <Bed className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No rooms yet</p>
                      <p className="text-sm">Add your first room to get started</p>
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => {
                    const timerDisplay = getRoomTimerDisplay(room);
                    return (
                      <tr key={room.name} className="border-b border-dark-border/20 hover:bg-gold/5 transition-all duration-200">
                        <td className="py-5 pl-8 pr-6 font-bold text-lg text-slate-100">{room.name}</td>
                        <td className="py-5 pr-6 capitalize font-semibold text-gold/90">{room.type}</td>
                        <td className="py-5 pr-6 font-semibold text-muted-foreground">{room.floor}</td>
                        <td className="py-5">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg w-fit ${
                              room.status === "Available"
                                ? "bg-gradient-to-r from-emerald-400/20 to-teal-400/20 border-2 border-emerald-400/50 text-emerald-400"
                                : "bg-gradient-to-r from-orange-400/20 to-red-400/20 border-2 border-orange-400/50 text-orange-400"
                            }`}>
                              {room.status === "Occupied" && <Timer size={14} />}
                              {room.status}
                            </span>
                            {timerDisplay && (
                              <span className="font-mono text-xs text-gold flex items-center gap-1">
                                <Clock size={12} />
                                {timerDisplay}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={() => handleToggleRoom(room)}
                              className="group relative p-3 rounded-2xl bg-gold/10 hover:bg-gold/20 border-2 border-gold/30 text-gold hover:text-gold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.98]"
                              title={room.status === "Available" ? "Occupy room" : "Vacate room"}
                            >
                              {room.status === "Available" ? (
                                <ChevronRight size={20} className="group-hover:rotate-90 transition-transform" />
                              ) : (
                                <ChevronLeft size={20} className="group-hover:rotate-90 transition-transform" />
                              )}
                            </button>
                            <button
                              onClick={() => startEdit(room)}
                              className="group relative p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/30 text-blue-400 hover:text-blue-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.98]"
                              title="Edit Room"
                            >
                              <Edit3 size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.name)}
                              className="group relative p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 text-red-400 hover:text-red-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.98]"
                              title="Delete Room"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingRoom && (
        <div className="admin-card border border-gold/20 bg-dark-card/95 p-8 shadow-2xl shadow-gold/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-white">Edit room</h3>
              <p className="text-sm text-muted-foreground">Update the room details and save your changes.</p>
            </div>
            <button
              onClick={() => setEditingRoom("")}
              className="rounded-full border border-muted-foreground/20 px-4 py-2 text-sm text-muted-foreground transition hover:border-gold/40 hover:text-gold"
            >
              Close
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              value={editForm.name}
              aria-label="Edit room name"
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            />
            <select
              title="Edit room type"
              aria-label="Edit room type"
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value as RoomType })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            >
              <option value="Regular">Regular Room</option>
              <option value="Premium">Premium Suite</option>
            </select>
            <select
              title="Edit floor"
              aria-label="Edit floor"
              value={editForm.floor}
              onChange={(e) => setEditForm({ ...editForm, floor: e.target.value })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            >
              <option value="1st">1st Floor</option>
              <option value="2nd">2nd Floor</option>
              <option value="3rd">3rd Floor</option>
              <option value="4th">4th Floor</option>
            </select>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => setEditingRoom("")}
              className="rounded-3xl border border-dark-border px-6 py-3 text-sm text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

