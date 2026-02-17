// StaffProfile.jsx - Updated with dark-page class fix
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const StaffProfile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [activeTab, setActiveTab]     = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Mock data — replace with real API calls
  const assignedFlights = [
    { id: 1, flightNumber: 'SK-101', route: 'DAC → DXB', status: 'Boarding',   passengers: 156, capacity: 180, departure: '14:30', gate: 'B12' },
    { id: 2, flightNumber: 'SK-205', route: 'DXB → LHR', status: 'Scheduled',  passengers: 189, capacity: 220, departure: '22:15', gate: 'C08' },
  ];

  const recentCheckins = [
    { id: 1, passenger: 'John Doe',     seat: '12A', time: '10:30 AM', status: 'Completed', flight: 'SK-101' },
    { id: 2, passenger: 'Jane Smith',   seat: '8C',  time: '10:45 AM', status: 'Completed', flight: 'SK-101' },
    { id: 3, passenger: 'Mike Johnson', seat: '15B', time: '11:00 AM', status: 'Pending',   flight: 'SK-101' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'checkin',   label: 'Check-In',  icon: '✅' },
    { id: 'flights',   label: 'My Flights', icon: '✈️' },
    { id: 'profile',   label: 'Profile',    icon: '👤' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Replace with real API call — GET /api/checkin/search?query={searchQuery}
    if (searchQuery.trim()) {
      setSearchResult({ passenger: 'John Doe', booking: searchQuery.toUpperCase(), flight: 'SK-101', seat: '12A', status: 'Ready for Check-in' });
    }
  };

  return (
    <div className="dark-page relative min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* Stars Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-[#030712] to-[#667eea]/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.4} />
        </Canvas>
      </div>
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 pt-24 pb-16">

        {/* Hero Header */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-amber-400 tracking-[0.3em] text-xs font-bold uppercase mb-2">Staff Portal</p>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Good day, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    {user?.full_name?.split(' ')[0] || 'Staff'}
                  </span> 🎫
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Employee ID: <span className="text-amber-400 font-mono">{user?.employee_id || 'N/A'}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-amber-400">87</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Check-ins</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{assignedFlights.length}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Flights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Today's Check-ins", value: '87', icon: '✅', color: 'border-emerald-500/20 bg-emerald-500/5' },
                  { label: 'Assigned Flights',  value: assignedFlights.length, icon: '✈️', color: 'border-amber-500/20 bg-amber-500/5' },
                  { label: 'Pending',            value: recentCheckins.filter(c => c.status === 'Pending').length, icon: '⏳', color: 'border-[#667eea]/20 bg-[#667eea]/5' },
                  { label: 'Shift',              value: 'ON', icon: '🟢', color: 'border-white/10 bg-white/5' },
                ].map((s, i) => (
                  <div key={i} className={`border ${s.color} rounded-2xl p-5 backdrop-blur-xl`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                      </div>
                      <span className="text-2xl">{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assigned Flights preview */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-8 h-px bg-amber-500"></span> Today's Flights
                </p>
                <div className="space-y-3">
                  {assignedFlights.map(f => (
                    <div key={f.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/20 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">{f.flightNumber}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{f.route}</p>
                          <p className="text-xs text-gray-500">Departure: {f.departure} • Gate {f.gate} • {f.passengers}/{f.capacity} pax</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        f.status === 'Boarding'   ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                    'bg-[#667eea]/20 text-[#667eea] border-[#667eea]/30'
                      }`}>● {f.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Check-ins */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-8 h-px bg-amber-500"></span> Recent Check-ins
                </p>
                <div className="space-y-3">
                  {recentCheckins.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                      <div>
                        <p className="font-semibold text-white text-sm">{c.passenger}</p>
                        <p className="text-xs text-gray-500">Seat {c.seat} • {c.flight} • {c.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        c.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>● {c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHECK-IN */}
          {activeTab === 'checkin' && (
            <div className="animate-fadeIn max-w-2xl mx-auto space-y-6">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-amber-500"></span> Passenger Check-In
                </p>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Enter booking ref or passport number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-warning px-6 whitespace-nowrap">Search</button>
                </form>

                {/* Search Result */}
                {searchResult && (
                  <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 animate-fadeIn">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Passenger Found</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        ['Passenger', searchResult.passenger],
                        ['Booking', searchResult.booking],
                        ['Flight', searchResult.flight],
                        ['Seat', searchResult.seat],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p className="text-xs text-gray-500 uppercase">{l}</p>
                          <p className="text-white font-semibold text-sm">{v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-success btn-sm flex-1">✅ Complete Check-in</button>
                      <button className="btn btn-warning btn-sm">🎫 Print Pass</button>
                    </div>
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '✅', label: 'Complete Check-in',  color: 'from-emerald-500 to-teal-600'   },
                    { icon: '🎫', label: 'Print Boarding Pass', color: 'from-[#667eea] to-[#764ba2]'  },
                    { icon: '💺', label: 'Change Seat',         color: 'from-amber-500 to-orange-600'  },
                    { icon: '🧳', label: 'Add Baggage',          color: 'from-rose-500 to-pink-600'    },
                  ].map((a, i) => (
                    <button key={i}
                      className={`btn bg-gradient-to-br ${a.color} text-white border-0 flex items-center gap-3 py-4 rounded-2xl hover:scale-105`}>
                      <span className="text-2xl">{a.icon}</span>
                      <span className="text-sm font-semibold">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">📋 Check-in Procedure</p>
                <ol className="text-xs text-amber-400/70 space-y-1.5 list-decimal list-inside">
                  <li>Verify passenger identity with valid travel documents</li>
                  <li>Search booking by reference number or passport</li>
                  <li>Confirm seat assignment and process baggage</li>
                  <li>Issue boarding pass and brief passenger on gate info</li>
                </ol>
              </div>
            </div>
          )}

          {/* MY FLIGHTS */}
          {activeTab === 'flights' && (
            <div className="space-y-4 animate-fadeIn">
              {assignedFlights.map(f => {
                const loadPct = Math.round((f.passengers / f.capacity) * 100);
                return (
                  <div key={f.id} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-2xl">✈️</div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">{f.flightNumber}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              f.status === 'Boarding' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-[#667eea]/20 text-[#667eea] border-[#667eea]/30'
                            }`}>● {f.status}</span>
                          </div>
                          <p className="text-white font-semibold">{f.route}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Dep: {f.departure} • Gate {f.gate} •{' '}
                            <span className={loadPct > 90 ? 'text-red-400' : 'text-emerald-400'}>
                              {f.passengers}/{f.capacity} pax ({loadPct}%)
                            </span>
                          </p>
                          {/* Load bar */}
                          <div className="mt-2 h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${loadPct > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                              style={{ width: `${loadPct}%` }} />
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('checkin')} className="btn btn-warning btn-sm">
                        Start Check-in →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-fadeIn max-w-xl">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-amber-500"></span> Staff Account
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" defaultValue={user?.full_name || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                    <input type="email" defaultValue={user?.sub || user?.email || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Employee ID</label>
                    <input type="text" defaultValue={user?.employee_id || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Role</label>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 inline-flex items-center gap-2">
                      <span>🎫</span>
                      <span className="text-amber-400 font-semibold text-sm">STAFF</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <button className="btn btn-secondary w-full text-sm">🔒 Change Password</button>
                    <button onClick={logoutUser} className="btn btn-danger w-full text-sm">🚪 Logout</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
