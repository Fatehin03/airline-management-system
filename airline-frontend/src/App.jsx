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
            {/* Temporary test */}
<Route path="/profile/passenger" element={<PassengerProfile />} />
<Route path="/profile/staff" element={<StaffProfile />} />
            <Route path="*" element={<div className="text-center p-10">Page not found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
