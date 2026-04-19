import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminDashboard,
  fetchAdminFlights,
  createAdminFlight,
  updateAdminFlight,
  deleteAdminFlight,
  fetchAdminUsers,
  updateAdminUserStatus,
  fetchAdminBookings,
} from "../api";

const initialFlightForm = {
  flight_number: "",
  origin: "",
  destination: "",
  departure_time: "",
  arrival_time: "",
  price: "",
  total_seats: "",
  status: "Scheduled",
};

const AdminProfile = () => {
  const [dashboard, setDashboard] = useState(null);
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(initialFlightForm);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [message, setMessage] = useState("");

  const loadAll = async () => {
    const [d, f, u, b] = await Promise.all([
      fetchAdminDashboard(),
      fetchAdminFlights(),
      fetchAdminUsers(),
      fetchAdminBookings(),
    ]);
    setDashboard(d.data?.totals || null);
    setFlights(f.data || []);
    setUsers(u.data || []);
    setBookings(b.data || []);
  };

  useEffect(() => {
    loadAll().catch(() => setMessage("Failed to load admin data."));
  }, []);

  const resetForm = () => {
    setForm(initialFlightForm);
    setEditingFlightId(null);
  };

  const saveFlight = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        total_seats: Number(form.total_seats),
      };

      if (editingFlightId) {
        await updateAdminFlight(editingFlightId, payload);
        setMessage("Flight updated successfully.");
      } else {
        await createAdminFlight(payload);
        setMessage("Flight created successfully.");
      }
      resetForm();
      await loadAll();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not save flight.");
    }
  };

  const editFlight = (flight) => {
    setEditingFlightId(flight.id);
    setForm({
      flight_number: flight.flight_number,
      origin: flight.origin,
      destination: flight.destination,
      departure_time: toLocalDateTime(flight.departure_time),
      arrival_time: toLocalDateTime(flight.arrival_time),
      price: String(flight.price),
      total_seats: String(flight.total_seats),
      status: flight.status,
    });
  };

  const removeFlight = async (flightId) => {
    try {
      await deleteAdminFlight(flightId);
      setMessage("Flight deleted.");
      await loadAll();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not delete flight.");
    }
  };

  const bookingCount = useMemo(() => bookings.length, [bookings]);

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Operations Panel</h1>
        {message && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
            {message}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Stat label="Users" value={dashboard?.users ?? 0} />
          <Stat label="Staff" value={dashboard?.staff ?? 0} />
          <Stat label="Passengers" value={dashboard?.passengers ?? 0} />
          <Stat label="Flights" value={dashboard?.flights ?? 0} />
          <Stat label="Bookings" value={bookingCount} />
        </div>

        <section className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold mb-4">{editingFlightId ? "Edit Flight" : "Add Flight"}</h2>
            <form onSubmit={saveFlight} className="space-y-3">
              <Input label="Flight Number" value={form.flight_number} onChange={(v) => setForm((p) => ({ ...p, flight_number: v }))} />
              <Input label="Origin" value={form.origin} onChange={(v) => setForm((p) => ({ ...p, origin: v }))} />
              <Input label="Destination" value={form.destination} onChange={(v) => setForm((p) => ({ ...p, destination: v }))} />
              <Input label="Departure" type="datetime-local" value={form.departure_time} onChange={(v) => setForm((p) => ({ ...p, departure_time: v }))} />
              <Input label="Arrival" type="datetime-local" value={form.arrival_time} onChange={(v) => setForm((p) => ({ ...p, arrival_time: v }))} />
              <Input label="Price" type="number" value={form.price} onChange={(v) => setForm((p) => ({ ...p, price: v }))} />
              <Input label="Total Seats" type="number" value={form.total_seats} onChange={(v) => setForm((p) => ({ ...p, total_seats: v }))} />
              <Select label="Status" value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))} options={["Scheduled", "Delayed", "Cancelled"]} />
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl py-2.5 font-bold">
                  {editingFlightId ? "Update Flight" : "Create Flight"}
                </button>
                {editingFlightId && (
                  <button type="button" onClick={resetForm} className="px-4 rounded-xl border border-white/10">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold mb-4">Flight Schedules</h2>
            <div className="space-y-3 max-h-[560px] overflow-auto pr-1">
              {flights.map((flight) => (
                <div key={flight.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold">{flight.flight_number} · {flight.origin} → {flight.destination}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(flight.departure_time).toLocaleString()} | {flight.status} | Seats {flight.available_seats}/{flight.total_seats}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => editFlight(flight)} className="px-3 py-1.5 rounded-lg border border-white/10 text-sm">Edit</button>
                    <button onClick={() => removeFlight(flight.id)} className="px-3 py-1.5 rounded-lg border border-red-400/20 text-red-300 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold mb-4">Users & Access Control</h2>
            <div className="space-y-2 max-h-[360px] overflow-auto">
              {users.map((user) => (
                <div key={user.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{user.full_name || user.email}</p>
                    <p className="text-xs text-gray-400">{user.email} · {user.role}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await updateAdminUserStatus(user.id, !user.is_active);
                      await loadAll();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs ${user.is_active ? "bg-red-500/20 text-red-200" : "bg-emerald-500/20 text-emerald-200"}`}
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold mb-4">Recent Bookings</h2>
            <div className="space-y-2 max-h-[360px] overflow-auto">
              {bookings.slice(0, 50).map((booking) => (
                <div key={booking.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-semibold">
                    {booking.flight?.flight_number || "N/A"} · {booking.user?.email || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Status: {booking.status} · Seat: {booking.seat_number || "Auto"} · {booking.flight?.origin} → {booking.flight?.destination}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-xs text-gray-400 uppercase tracking-[0.2em]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-amber-500/50"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs text-gray-400 uppercase tracking-[0.2em]">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-amber-500/50"
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-[#0b1220]">
          {option}
        </option>
      ))}
    </select>
  </div>
);

const toLocalDateTime = (value) => {
  if (!value) return "";
  const dt = new Date(value);
  const offset = dt.getTimezoneOffset();
  const local = new Date(dt.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

export default AdminProfile;
