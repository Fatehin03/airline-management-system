import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Ensure this path is correct
import './index.css';

// Import your working components
import Home from './pages/Home';
import Flights from './pages/Flights';
import Login from './pages/Login';
import Register from './pages/Register';

const Navbar = () => (
  <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
    <Link to="/" className="text-2xl font-bold text-blue-800 tracking-tight">
      SkyLink Airlines
    </Link>
    <div className="space-x-6 flex items-center">
      <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
      <Link to="/flights" className="text-gray-600 hover:text-blue-600 font-medium">Flights</Link>
      <Link to="/login" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition">
        Login
      </Link>
      <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
        Sign Up
      </Link>
    </div>
  </nav>
);

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<div className="text-center py-20 text-2xl">Page Not Found</div>} />
      </Routes>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap with AuthProvider for Login logic to work */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
