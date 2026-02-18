import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // Always read directly from localStorage to avoid React state timing issues.
  // After login, the token is stored synchronously in localStorage before
  // React state updates, so this is the most reliable source.
  const getRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return null;
      }
      return decoded.role;
    } catch {
      return null;
    }
  };

  // Use localStorage-derived role as primary, fall back to React state
  const role = getRole() || user?.role;

  if (!role) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the correct profile based on actual role
    if (role === 'staff') return <Navigate to="/profile/staff" replace />;
    if (role === 'passenger') return <Navigate to="/profile/passenger" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
