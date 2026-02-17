// airline-frontend/src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import PassengerProfile from './pages/PassengerProfile';  // Add this import
import StaffProfile from './pages/StaffProfile';          // Add this import
import ProtectedRoute from './components/ProtectedRoute'; // Add this import (create if needed)
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flights" element={<Flights />} />
            <Route
              path="/profile/passenger"
              element={
                <ProtectedRoute allowedRoles={['passenger']}>
                  <PassengerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffProfile />
                </ProtectedRoute>
              }
            />
            {/* Optional: Add a catch-all for 404 */}
            <Route path="*" element={<div className="text-center p-10">Page not found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
