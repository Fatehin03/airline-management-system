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
            <Route path="/profile/passenger" element={
              <ProtectedRoute allowedRoles={['passenger']}>
                <PassengerProfile />
              </ProtectedRoute>
            } />
            <Route path="/profile/staff" element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffProfile />
              </ProtectedRoute>
            } />
            <Route path="*" element={<div className="text-center p-10">Page not found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
