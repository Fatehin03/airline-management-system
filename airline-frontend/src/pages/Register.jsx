// Register.jsx - Role-based: Passenger & Staff only
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { register } from '../api';

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('passenger');
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', confirmPassword: '', employee_id: ''
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const isStaff = selectedRole === 'staff';

  const accentColor = isStaff
    ? { text: 'text-amber-400', active: 'from-amber-500 to-orange-500', border: 'border-amber-500/30', bg: 'bg-amber-500/10' }
    : { text: 'text-[#667eea]', active: 'from-[#667eea] to-[#764ba2]',  border: 'border-[#667eea]/30', bg: 'bg-[#667eea]/10' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    if (isStaff && !formData.employee_id.trim()) return setError('Employee ID is required for staff');
    setLoading(true);
    try {
      await register({
        full_name:   formData.full_name,
        email:       formData.email,
        password:    formData.password,
        role:        selectedRole,
        employee_id: isStaff ? formData.employee_id.toUpperCase() : null,
      });
      alert('✅ Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="dark-page relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden py-10">

      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#667eea]/10 via-[#030712] to-[#764ba2]/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Ambient glow */}
      <div className={`absolute top-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700 ${
        isStaff ? 'bg-amber-600/8' : 'bg-[#764ba2]/8'
      }`} />
      <div className={`absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700 ${
        isStaff ? 'bg-orange-500/8' : 'bg-[#667eea]/8'
      }`} />

      {/* Card */}
      <div className="relative z-20 w-full max-w-lg px-6 animate-fadeIn">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-float inline-block">
              {isStaff ? '🎫' : '🛫'}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create Account
            </h1>
            <p className={`text-sm tracking-[0.2em] uppercase font-semibold ${accentColor.text}`}>
              Join SkyLink Airlines
            </p>
            <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent mt-4 opacity-40 ${accentColor.text}`} />
          </div>

          {/* Role Selector */}
          <div className="mb-7">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'passenger', label: 'Passenger', icon: '🧳', desc: 'Book & manage flights' },
                { id: 'staff',     label: 'Staff',     icon: '🎫', desc: 'Check-in & operations'  },
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setSelectedRole(r.id); setError(''); setFormData(f => ({ ...f, employee_id: '' })); }}
                  className={`p-4 rounded-2xl border transition-all text-center ${
                    selectedRole === r.id
                      ? `border-current ${accentColor.bg} shadow-lg ${accentColor.text}`
                      : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-3xl mb-1.5">{r.icon}</div>
                  <div className="text-sm font-bold">{r.label}</div>
                  <div className="text-[11px] opacity-60 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Employee ID — Staff only */}
            {isStaff && (
              <div className={`${accentColor.bg} border ${accentColor.border} rounded-2xl p-4`}>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                  🔐 Employee ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. STAFF-001"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value.toUpperCase() })}
                  required={isStaff}
                  disabled={loading}
                />
                <p className="text-[11px] text-amber-400/60 mt-2">Contact your supervisor for a valid employee ID</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <input type="text" placeholder="John Doe" value={formData.full_name} onChange={update('full_name')} required disabled={loading} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                placeholder={isStaff ? 'staff@skylink.com' : 'you@skylink.com'}
                value={formData.email}
                onChange={update('email')}
                required
                disabled={loading}
              />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input type="password" placeholder="Min 6 chars" value={formData.password} onChange={update('password')} required disabled={loading} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm</label>
                <input type="password" placeholder="Re-enter" value={formData.confirmPassword} onChange={update('confirmPassword')} required disabled={loading} />
              </div>
            </div>

            {/* Staff notice */}
            {isStaff && (
              <p className="text-xs text-amber-400/70 text-center">
                ⚠️ Staff accounts require approval from an administrator
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`btn w-full text-white bg-gradient-to-r ${accentColor.active} border-0 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading
                ? 'Creating Account...'
                : `🚀 Register as ${isStaff ? 'Staff' : 'Passenger'}`}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className={`font-semibold transition-colors ${accentColor.text} hover:opacity-80`}>
                Sign in here
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Admin?{' '}
              <a href="https://admin.skylink.com" className="text-[#667eea]/60 hover:text-[#667eea] transition-colors">
                Go to Admin Portal →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
