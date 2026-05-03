import { useState } from "react";
import { Link } from "react-router-dom";
import { useSnacksDrinks, SnackDrink } from "@/lib/useSnacksDrinks";
import { Plus, Edit3, Trash2, Coffee, UtensilsCrossed, CheckCircle, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type SnackDrinkForm = Omit<SnackDrink, 'id'>;

export default function AdminSnacksDrinks() {
  const { snacksDrinks, toggleAvailability, addSnackDrink, updateSnackDrink, deleteSnackDrink } = useSnacksDrinks();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string>("");
  const [formData, setFormData] = useState<SnackDrinkForm>({
    name: "",
    type: "Snack",
    price: 0,
    desc: "",
    image: "/placeholder.svg",
    available: true
  });

  const available = snacksDrinks.filter(item => item.available).length;
  const unavailable = snacksDrinks.length - available;
  const total = snacksDrinks.length;

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Snack",
      price: 0,
      desc: "",
      image: "/placeholder.svg",
      available: true
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || formData.price <= 0) return;

    if (editingId) {
      updateSnackDrink(editingId, formData);
      setEditingId("");
    } else {
      addSnackDrink(formData);
    }
    setShowForm(false);
    resetForm();
  };

  const startEdit = (item: SnackDrink) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.28em] text-gold/70">Menu management</p>
          <div className="space-y-2">
            <h1 className="font-display text-4xl text-white">Snacks & Drinks</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">Manage availability and menu items for guest orders.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/foods" className="inline-flex items-center gap-2 rounded-3xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            View All Foods & Drinks →
          </Link>
          <button
            onClick={() => {
              resetForm();
              setEditingId("");
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-dark shadow-lg shadow-gold/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={18} />
            Add item
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300 shadow-sm shadow-emerald-400/10">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Available</p>
              <p className="text-3xl font-semibold text-white">{available}</p>
            </div>
          </div>
        </div>
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-300 shadow-sm shadow-orange-400/10">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Unavailable</p>
              <p className="text-3xl font-semibold text-white">{unavailable}</p>
            </div>
          </div>
        </div>
        <div className="admin-card border-transparent bg-gradient-to-br from-dark-card/95 to-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gold/10 text-gold shadow-sm shadow-gold/10">
              <div className="text-lg font-semibold">{total}</div>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Total items</p>
              <p className="text-3xl font-semibold text-white">{total}</p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="admin-card border border-gold/20 bg-dark-card/95 p-8 shadow-2xl shadow-gold/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-white">
                {editingId ? "Edit item" : "Add new item"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {editingId ? "Update menu item details" : "Add a new snack or drink to the menu"}
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId("");
                resetForm();
              }}
              className="rounded-full border border-muted-foreground/20 px-4 py-2 text-sm text-muted-foreground transition hover:border-gold/40 hover:text-gold"
            >
              Close
            </button>
          </div>
          <div className="space-y-4">
            <input
              placeholder="Item Name e.g. Cola (355ml)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Snack' | 'Drink' })}
                className="rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
              >
                <option value="Snack">Snack</option>
                <option value="Drink">Drink</option>
              </select>
              <input
                type="number"
                placeholder="Price ₱"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
              />
            </div>
            <textarea
              placeholder="Description (e.g. Refreshing classic cola)"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              rows={3}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10 resize-vertical"
            />
            <input
              placeholder="Image URL (or /placeholder.svg)"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-3xl border border-dark-border bg-background/5 px-5 py-4 text-lg text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId("");
                resetForm();
              }}
              className="rounded-3xl border border-dark-border px-6 py-3 text-sm text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || formData.price <= 0}
              className="rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-dark transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? "Update" : "Add Item"}
            </button>
          </div>
        </div>
      )}

      <div className="admin-card p-1 bg-dark-card/80 border border-dark-border/60 shadow-2xl">
        <div className="overflow-hidden rounded-[2rem] bg-background/5">
          <div className="flex flex-col gap-4 border-b border-dark-border/50 bg-dark-card/80 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Menu inventory</h2>
              <p className="text-sm text-muted-foreground">Toggle availability and manage snack/drink offerings.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm text-gold">
              <span className="font-medium">{total}</span> items
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-dark-card/90 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Item</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Type</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Price</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Status</th>
                  <th className="px-6 py-4 uppercase tracking-[0.18em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {snacksDrinks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      <Coffee className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No menu items</p>
                      <p className="text-sm">Add your first snack or drink</p>
                    </td>
                  </tr>
                ) : (
                  snacksDrinks.map((item) => (
                    <tr key={item.id} className="border-b border-dark-border/20 hover:bg-gold/5 transition-all duration-200">
                      <td className="py-5 pl-8 pr-6 font-bold text-lg text-slate-100 max-w-md truncate">{item.name}</td>
                      <td className="py-5 pr-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.type === 'Snack' 
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-5 pr-6 font-semibold text-gold">₱{item.price}</td>
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                          <span className={`text-sm font-bold uppercase tracking-[0.18em] ${
                            item.available ? 'text-emerald-300' : 'text-orange-300'
                          }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEdit(item)}
                            className="group relative p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/30 text-blue-400 hover:text-blue-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.98]"
                          >
                            <Edit3 size={20} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${item.name}?`)) {
                                deleteSnackDrink(item.id);
                              }
                            }}
                            className="group relative p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 text-red-400 hover:text-red-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.98]"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

