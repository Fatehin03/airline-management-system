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



<Routes>
  {/* TEST ROUTE - you should see this big green message on the homepage */}
  <Route 
    path="/" 
    element={
      <div className="text-center pt-40">
        <h1 className="text-6xl font-bold text-green-400">✅ BUILD SUCCESS - Feb 18 Test</h1>
        <p className="text-white mt-4">If you see this, the new code is live!</p>
      </div>
    } 
  />

  <Route path="/profile/passenger" element={<PassengerProfile />} />
  <Route path="/profile/staff" element={<StaffProfile />} />

  {/* Better 404 that shows the actual URL */}
  <Route 
    path="*" 
    element={
      <div className="text-center pt-40">
        <h1 className="text-4xl text-red-400">404 - Page Not Found</h1>
        <p className="text-white mt-4">Current URL: {window.location.hash || window.location.pathname}</p>
      </div>
    } 
  />
</Routes>

            
            
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
