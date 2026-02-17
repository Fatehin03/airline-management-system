// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Runs once on app start — restores session from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    console.warn("Token expired — logging out");
                    logoutUser();
                } else {
                    setUser(decoded);
                }
            } catch (e) {
                console.error("Token decoding failed:", e);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const loginUser = (token) => {
        localStorage.setItem('token', token);
        try {
            // JWT now contains: sub, role, full_name, employee_id, user_id
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (e) {
            console.error("Error decoding token during login:", e);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = window.location.origin;
    };

    // Helper — check if logged-in user has a specific role
    // Usage: hasRole('staff') → true/false
    const hasRole = (requiredRole) => user?.role === requiredRole;

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};
