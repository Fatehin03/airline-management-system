import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setLoading(false);
          return;
        }

        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch {
            setUser(decoded);
            localStorage.setItem("user", JSON.stringify(decoded));
          }
        } else {
          setUser(decoded);
          localStorage.setItem("user", JSON.stringify(decoded));
        }
      } catch (e) {
        console.error("Token decoding failed:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const loginUser = (token, userData = null) => {
    localStorage.setItem("token", token);

    try {
      const decoded = jwtDecode(token);

      const mergedUser = {
        ...decoded,
        ...(userData || {}),
        role: userData?.role || decoded.role || "passenger",
        full_name: userData?.full_name || decoded.full_name || "",
        email: userData?.email || decoded.email || decoded.sub || "",
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);
    } catch (e) {
      console.error("Error decoding token during login:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
    window.location.href = window.location.origin + "/#/";
  };

  const hasRole = (requiredRole) =>
    user?.role?.toLowerCase() === requiredRole?.toLowerCase();

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, loginUser, logoutUser, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
