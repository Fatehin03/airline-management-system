import React, { useState, useEffect } from 'react';
import { fetchFlights, bookFlight } from '../api';
import FlightCard from '../components/FlightCard';
import { Plane } from 'lucide-react'; // Import the Plane icon

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We set a 2-second timeout to show off the animation
    const getFlights = async () => {
      try {
        const { data } = await fetchFlights();
        setFlights(data);
      } catch (err) {
        console.error("Failed to load flights");
      } finally {
        // Delaying the loader slightly so the animation is visible
        setTimeout(() => setLoading(false), 2000);
      }
    };
    getFlights();
  }, []);

  const handleBooking = async (id) => {
    try {
      await bookFlight({ flight_id: id });
      alert("Success! Your seat is reserved.");
    } catch (err) {
      alert("Please login to book a flight.");
    }
  };

  // --- ANIMATION VIEW ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          {/* This is the moving bar */}
          <div className="absolute top-0 h-full bg-blue-600 animate-progress"></div>
        </div>
        <div className="mt-4 flex items-center space-x-2 text-blue-800 font-display font-bold text-xl animate-pulse">
          <Plane className="animate-bounce" />
          <span>Verifying Credentials & Searching Skies...</span>
        </div>
      </div>
    );
  }

  // --- ACTUAL DATA VIEW ---
  return (
    <div className="container mx-auto py-10 px-6 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-8 border-b pb-4 text-blue-900">Available Flights</h2>
      
      {flights.length > 0 ? (
        <div className="grid gap-6">
          {flights.map(f => (
            <div key={f.id} className="hover:scale-[1.01] transition-transform">
               <FlightCard flight={f} onBook={handleBooking} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded shadow">
          <p className="text-gray-500 italic">No flights available currently.</p>
        </div>
      )}
    </div>
  );
};

export default Flights;
