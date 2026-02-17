// PassengerProfile.jsx - Updated with dark-page class fix
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const PassengerProfile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);

  // Mock data — replace with real API calls
  const bookings = [
    { id: 1, flightNumber: 'SK-101', from: 'Dhaka (DAC)',  to: 'Dubai (DXB)',  date: '2026-03-15', status: 'Confirmed', seat: '12A', class: 'Business' },
    { id: 2, flightNumber: 'SK-205', from: 'Dubai (DXB)',  to: 'London (LHR)', date: '2026-04-20', status: 'Pending',   seat: '8C',  class: 'Economy'  },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview',    icon: '📊' },
    { id: 'bookings', label: 'My Flights',  icon: '✈️' },
    { id: 'profile',  label: 'Profile',     icon: '👤' },
  ];

  return (
    <div className="dark-page relative min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* Stars Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-[#030712] to-[#667eea]/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.4} />
        </Canvas>
      </div>
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 pt-24 pb-16">

        {/* Hero Header */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-emerald-400 tracking-[0.3em] text-xs font-bold uppercase mb-2">Passenger Portal</p>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#667eea]">
                    {user?.full_name?.split(' ')[0] || 'Traveler'}
                  </span> 🧳
                </h1>
                <p className="text-gray-500 mt-1 text-sm">{user?.sub || user?.email}</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{bookings.length}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Flights</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-amber-400">12,450</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Miles</p>
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
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Bookings', value: bookings.length, icon: '🎟️', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
                  { label: 'Miles Earned',   value: '12,450',         icon: '⭐', color: 'from-amber-500/20 to-amber-600/10',    border: 'border-amber-500/20'   },
                  { label: 'Next Departure', value: '15 Mar',         icon: '🛫', color: 'from-[#667eea]/20 to-[#764ba2]/10',    border: 'border-[#667eea]/20'   },
                ].map((s, i) => (
                  <div key={i} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-6 backdrop-blur-xl`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{s.label}</p>
                        <p className="text-3xl font-bold text-white">{s.value}</p>
                      </div>
                      <span className="text-4xl">{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-8 h-px bg-emerald-500"></span> Quick Actions
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: '🔍', label: 'Search Flights',    color: 'from-[#667eea] to-[#764ba2]',  action: () => navigate('/flights') },
                    { icon: '📱', label: 'Mobile Check-in',   color: 'from-amber-500 to-orange-600'   },
                    { icon: '💳', label: 'Payment Methods',   color: 'from-emerald-500 to-teal-600'   },
                    { icon: '📞', label: 'Support',           color: 'from-rose-500 to-pink-600'      },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action}
                      className={`btn btn-sm bg-gradient-to-br ${a.color} text-white border-0 flex flex-col items-center gap-2 py-5 rounded-2xl hover:scale-105`}>
                      <span className="text-3xl">{a.icon}</span>
                      <span className="text-xs font-semibold">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent bookings preview */}
              {bookings.length > 0 && (
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-emerald-500"></span> Recent Bookings
                  </p>
                  <div className="space-y-3">
                    {bookings.slice(0, 2).map(b => (
                      <div key={b.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white">{b.flightNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>{b.status}</span>
                          </div>
                          <p className="text-xs text-gray-500">{b.from} → {b.to} • {b.date}</p>
                        </div>
                        <span className="text-xs text-gray-500">{b.seat}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('bookings')} className="btn btn-sm btn-secondary w-full mt-4 text-xs">
                    View All Bookings →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 animate-fadeIn">
              {bookings.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="text-6xl mb-4">✈️</div>
                  <p className="text-lg mb-4">No bookings yet</p>
                  <button onClick={() => navigate('/flights')} className="btn btn-primary">Search Flights</button>
                </div>
              ) : bookings.map(b => (
                <div key={b.id} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-bold">{b.flightNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>● {b.status}</span>
                        <span className="text-xs text-gray-500 ml-auto">{b.class}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[['From', b.from], ['To', b.to], ['Date', b.date], ['Seat', b.seat]].map(([l, v]) => (
                          <div key={l}>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{l}</p>
                            <p className="text-white font-semibold mt-0.5 text-sm">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="btn btn-secondary btn-sm text-xs">View Ticket</button>
                      <button className="btn btn-danger btn-sm text-xs">Cancel</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-fadeIn max-w-xl">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-px bg-emerald-500"></span> Account Information
                  </p>
                  <button onClick={() => setEditing(!editing)}
                    className={`btn btn-sm text-xs ${editing ? 'btn-danger' : 'btn-success'}`}>
                    {editing ? '✕ Cancel' : '✏️ Edit'}
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" defaultValue={user?.full_name || ''} readOnly={!editing} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                    <input type="email" defaultValue={user?.sub || user?.email || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Role</label>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 inline-flex items-center gap-2">
                      <span>🧳</span>
                      <span className="text-emerald-400 font-semibold text-sm">PASSENGER</span>
                    </div>
                  </div>
                  {editing && (
                    <button className="btn btn-success w-full text-sm">💾 Save Changes</button>
                  )}
                  <div className="border-t border-white/10 pt-4">
                    <button className="btn btn-secondary w-full text-sm mb-3">🔒 Change Password</button>
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

export default PassengerProfile;
