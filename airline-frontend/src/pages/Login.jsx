// Login.jsx - Matches dark space/premium aesthetic of Home.jsx
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { login } from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await login(formData);
      loginUser(data.access_token);
      const role = data.role || data.user?.role;
      if (role === 'admin') navigate('/profile/admin');
      else if (role === 'staff') navigate('/profile/staff');
      else navigate('/profile/passenger');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden">
      
      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#667eea]/10 via-[#030712] to-[#764ba2]/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#667eea]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#764ba2]/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Login Card */}
      <div className="relative z-20 w-full max-w-md px-6 animate-fadeIn">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-float inline-block">✈️</div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{fontFamily: 'Poppins, sans-serif'}}>
              Welcome Back
            </h1>
            <p className="text-sm tracking-[0.2em] text-[#667eea] uppercase font-semibold">SkyLink Airlines</p>
            <div className="h-px bg-gradient-to-r from-transparent via-[#667eea]/50 to-transparent mt-4" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@skylink.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 !text-white !bg-white/5 placeholder-gray-500 focus:border-[#667eea]/50 focus:!bg-white/10 transition-all outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 !text-white !bg-white/5 placeholder-gray-500 focus:border-[#667eea]/50 focus:!bg-white/10 transition-all outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            {/* Premium Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner w-5 h-5 border-2" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ✈️ Sign In
                </span>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#667eea] hover:text-[#764ba2] font-semibold transition-colors">
                Register here
              </Link>
            </p>
            <Link to="/forgot-password" className="block text-xs text-amber-400/70 hover:text-amber-400 transition-colors">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
