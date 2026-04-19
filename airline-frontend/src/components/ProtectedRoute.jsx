import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin mb-4" />
          <p className="text-sm tracking-[0.25em] uppercase text-amber-300">
            Restoring Session
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = user?.role?.toLowerCase();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const redirectByRole = {
      admin: "/profile/admin",
      staff: "/profile/staff",
      passenger: "/profile/passenger",
    };
    return (
      <Navigate
        to={redirectByRole[role] || "/profile/passenger"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
