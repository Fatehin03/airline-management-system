// Register.jsx - Matches dark space/premium aesthetic of Home.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { register } from '../api';

const ROLES = [
  { id: 'passenger', label: 'Passenger', icon: '🧳', desc: 'Book & manage flights' },
  { id: 'staff',     label: 'Staff',     icon: '🎫', desc: 'Check-in & boarding' },
  { id: 'admin',     label: 'Admin',     icon: '🛡️', desc: 'System management'  },
];

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', confirmPassword: '',
    role: 'passenger', employee_id: ''
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requiresEmpId = formData.role === 'staff' || formData.role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");
    if (requiresEmpId && !formData.employee_id.trim()) return setError("Employee ID is required");
    setLoading(true);
    try {
      await register({
        full_name: formData.full_name, email: formData.email,
        password: formData.password, role: formData.role,
        employee_id: requiresEmpId ? formData.employee_id : null
      });
      alert(`✅ Account created! Please login.`);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden py-10">

      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#667eea]/10 via-[#030712] to-[#764ba2]/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
        </Canvas>
      </div>
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#764ba2]/8 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#667eea]/8 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Card */}
      <div className="relative z-20 w-full max-w-lg px-6 animate-fadeIn">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-float inline-block">🛫</div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{fontFamily: 'Poppins, sans-serif'}}>
              Create Account
            </h1>
            <p className="text-sm tracking-[0.2em] text-[#667eea] uppercase font-semibold">Join SkyLink Airlines</p>
            <div className="h-px bg-gradient-to-r from-transparent via-[#667eea]/50 to-transparent mt-4" />
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id, employee_id: '' })}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      formData.role === r.id
                        ? 'border-[#667eea] bg-[#667eea]/20 shadow-glow'
                        : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{r.icon}</div>
                    <div className="text-xs font-bold text-white">{r.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Employee ID (conditional) */}
            {requiresEmpId && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                  🔐 Employee ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., STAFF-001 or ADMIN-001"
                  className="w-full bg-white/5 border border-amber-500/30 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-amber-500/60 transition-all outline-none uppercase"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value.toUpperCase() })}
                  required={requiresEmpId}
                  disabled={loading}
                />
                <p className="text-[11px] text-amber-400/60 mt-1.5">Contact your supervisor for a valid employee ID</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text" placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:border-[#667eea]/50 focus:bg-white/10 transition-all outline-none"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email" placeholder="you@skylink.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:border-[#667eea]/50 focus:bg-white/10 transition-all outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required disabled={loading}
              />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password" placeholder="Min 6 chars"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:border-[#667eea]/50 transition-all outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm</label>
                <input
                  type="password" placeholder="Re-enter"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:border-[#667eea]/50 transition-all outline-none"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required disabled={loading}
                />
              </div>
            </div>

            {/* Premium Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#667eea] hover:text-[#764ba2] font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
