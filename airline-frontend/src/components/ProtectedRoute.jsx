import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // Fallback: read directly from localStorage in case
  // React state hasn't updated yet after login redirect
  const getRole = () => {
    if (user?.role) return user.role;
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) return null;
      return decoded.role;
    } catch {
      return null;
    }
  };

  const role = getRole();

  if (!role) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
