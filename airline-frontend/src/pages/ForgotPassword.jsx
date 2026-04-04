import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { forgotPassword } from '../api';
import { Copy, Check } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await forgotPassword({ email });
      setSuccess(true);
      // If reset_link is in response, display it
      if (data.reset_link) {
        setResetLink(data.reset_link);
      }
      // Auto-navigate after 5 seconds only if no link shown
      if (!data.reset_link) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset link.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="dark-page relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden px-6 py-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-[#030712] to-blue-500/10 z-10" />
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
          </Canvas>
        </div>

        <div className="relative z-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Reset Link Ready</h2>
          
          {resetLink ? (
            <>
              <p className="text-gray-300 text-center mb-6">Here's your password reset link:</p>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
                <p className="text-xs text-gray-400 mb-2">Reset Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resetLink}
                    readOnly
                    className="flex-1 bg-black/30 border border-white/20 rounded-lg px-2 py-2 text-xs font-mono text-white overflow-auto"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-amber-500 hover:bg-amber-600 text-black p-2 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              <Link
                to={resetLink}
                className="block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold transition mb-4"
              >
                Open Reset Link
              </Link>
              <p className="text-gray-400 text-center text-sm">Or check your email for the reset link.</p>
            </>
          ) : (
            <>
              <p className="text-gray-300 text-center">Check your email for the password reset link.</p>
              <p className="text-gray-500 text-center text-sm mt-4">Redirecting to login in 3 seconds...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dark-page relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-[#030712] to-blue-500/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
        </Canvas>
      </div>

      <div className="relative z-20 bg-white/5 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 backdrop-blur-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Forgot Password</h2>
        {error && <p className="text-red-300 text-sm mb-4 text-center bg-red-500/10 border border-red-500/30 p-2 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              className="mt-1 block w-full border border-white/20 bg-black/30 text-white rounded-xl p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-bold transition">
            Send Reset Link
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Remember your password? <Link to="/login" className="text-amber-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
