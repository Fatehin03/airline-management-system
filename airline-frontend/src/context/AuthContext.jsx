import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logoutUser();
        return;
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(decoded);
      }
    } catch (e) {
      console.error("Token decoding failed:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  const loginUser = (token, userData = null) => {
    localStorage.setItem("token", token);

    try {
      const decoded = jwtDecode(token);

      const mergedUser = {
        ...decoded,
        ...(userData || {}),
        role: userData?.role || decoded.role,
        full_name: userData?.full_name || decoded.full_name || "",
        email: userData?.email || decoded.email || decoded.sub || "",
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);
    } catch (e) {
      console.error("Error decoding token during login:", e);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = window.location.origin + "/#/";
  };

  const hasRole = (requiredRole) =>
    user?.role?.toLowerCase() === requiredRole?.toLowerCase();

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
