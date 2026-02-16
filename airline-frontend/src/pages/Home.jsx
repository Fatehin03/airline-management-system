import { Canvas } from "@react-three/fiber";
import { Stars, Float, Environment } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe, Clock, Plane, MapPin, Calendar, Users } from "lucide-react";
import Lottie from "lottie-react";
import airplaneAnimation from "../assets/airplane.json";

/* ================= PREMIUM AIRPLANE ================= */
const Airplane = () => {
  return (
    <div className="absolute top-[15%] left-0 w-full flex items-center justify-center z-10 pointer-events-none">
      <div className="w-[350px] md:w-[500px] lg:w-[650px] opacity-95 drop-shadow-[0_20px_80px_rgba(255,255,255,0.2)]">
        <Lottie animationData={airplaneAnimation} loop={true} />
      </div>
    </div>
  );
};

/* ================= WORLD MAP + PREMIUM ROUTES ================= */
const WorldMapRoutes = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-40 z-0">
      <svg className="w-[90%] h-[70%]" viewBox="0 0 1200 600">
        <path d="M 100 400 Q 300 100 500 350 T 900 300" stroke="#fbbf24" strokeWidth="1" fill="none" strokeDasharray="5 5" opacity="0.3" />
        <path d="M 200 500 Q 600 50 1100 400" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="10 10">
          <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="20s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
};

/* ================= MAIN HOME ================= */
const Home = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center pt-20 pb-32">
        
        {/* Deep Space / World Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-[#030712] to-[#030712] z-10" />
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
          </Canvas>
        </div>

        <WorldMapRoutes />
        <Airplane />

        {/* Hero Text */}
        <div className="relative z-20 text-center px-6 mt-10">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-bold mb-4 uppercase">Global Luxury Airlines</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic leading-tight mb-4">
            Experience the World in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 font-bold not-italic">Ultimate Luxury</span>
          </h1>
        </div>

        {/* ===== FLIGHT SEARCH PANEL (Glassmorphism) ===== */}
        <div className="relative z-30 w-full max-w-5xl px-6 mt-12">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Plane className="text-amber-400" size={20} />
              <span className="font-bold tracking-widest text-sm">FLIGHT SEARCH</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SearchInput label="From" placeholder="Select Departure" icon={<MapPin size={18}/>} />
              <SearchInput label="To" placeholder="Select Destination" icon={<MapPin size={18}/>} />
              <SearchInput label="Depart" placeholder="DD/MM/YYYY" icon={<Calendar size={18}/>} />
              <SearchInput label="Class" placeholder="Business Class" icon={<Users size={18}/>} />
              
              <div className="md:col-span-2 flex items-end">
                <Link to="/flights" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-center flex items-center justify-center gap-2">
                  Search Flights <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className="py-20 relative z-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-20 bg-amber-500/50"></div>
          <h2 className="text-sm font-bold tracking-[0.4em] text-amber-500 uppercase">Popular Destinations</h2>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DestinationCard city="Dubai" img="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600" />
          <DestinationCard city="London" img="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600" />
          <DestinationCard city="Singapore" img="https://images.unsplash.com/photo-1525625230556-8e8ad285396e?q=80&w=600" />
          <DestinationCard city="New York" img="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600" />
        </div>
      </section>

      {/* ===== LUXURY FEATURES ===== */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <FeatureCard icon={<ShieldCheck />} title="Luxury Safety" desc="Top-Notch Security" />
          <FeatureCard icon={<Globe />} title="Global Network" desc="150+ Destinations" />
          <FeatureCard icon={<Clock />} title="Smart Scheduling" desc="On-Time Flights" />
        </div>
      </section>

      {/* ===== SKY EXPERIENCE (STATS) ===== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img src="https://images.unsplash.com/photo-1540339832862-47452993c66e?q=80&w=1200" alt="Interior" className="hover:scale-105 transition-transform duration-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-[0.3em] text-amber-500 uppercase mb-4">Sky Experience</h2>
            <h3 className="text-4xl md:text-5xl font-serif italic mb-8">Fly in <span className="not-italic font-bold text-white">5-Star</span> Comfort</h3>
            
            <div className="grid grid-cols-3 gap-8 mb-12">
              <StatItem value="5★" label="Service" />
              <StatItem value="150+" label="Destinations" />
              <StatItem value="99%" label="On-Time" />
            </div>

            <p className="text-gray-400 mb-10 text-lg">Trusted by <span className="text-white font-bold">2M+ Travelers</span> globally for premium aviation services.</p>
            
            <div className="flex flex-wrap gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/73/SkyTeam_logo.svg/1200px-SkyTeam_logo.svg.png" className="h-6" alt="Partner" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Expedia_Logo_2023.svg/2560px-Expedia_Logo_2023.svg.png" className="h-6" alt="Partner" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

const SearchInput = ({ label, placeholder, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/60 group-hover:text-amber-400 transition-colors">{icon}</div>
      <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-gray-600"
      />
    </div>
  </div>
);

const DestinationCard = ({ city, img }) => (
  <div className="relative group rounded-2xl overflow-hidden h-80 shadow-xl border border-white/5">
    <img src={img} alt={city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
    <div className="absolute bottom-6 left-6">
      <h3 className="text-2xl font-serif italic text-white group-hover:text-amber-200 transition-colors">{city}</h3>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex items-center gap-6 hover:bg-white/10 transition-all group">
    <div className="p-4 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);

const StatItem = ({ value, label }) => (
  <div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-xs text-gray-500 tracking-widest uppercase">{label}</div>
  </div>
);

export default Home;
