import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, LockKeyhole } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { adminLogin } from "../api";
import { AuthContext } from "../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await adminLogin(form);
      const decoded = jwtDecode(data.access_token);

      const mergedUser = {
        ...decoded,
        role: "admin",
        email: decoded?.email || decoded?.sub || form.email,
        full_name: decoded?.full_name || "",
      };

      loginUser(data.access_token, mergedUser);
      navigate("/profile/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-3xl">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Secure airline operations dashboard</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-400/20 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            icon={<Mail size={16} />}
            type="email"
            placeholder="admin@skylink.com"
            value={form.email}
            onChange={(email) => setForm((prev) => ({ ...prev, email }))}
          />
          <Input
            icon={<LockKeyhole size={16} />}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(password) => setForm((prev) => ({ ...prev, password }))}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3.5 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ icon, type, placeholder, value, onChange }) => (
  <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 flex items-center gap-3">
    <span className="text-amber-400/70">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full bg-transparent outline-none text-sm"
    />
  </div>
);

export default AdminLogin;
