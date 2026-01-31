import { Link } from 'react-router-dom';
import { Plane, ShieldCheck, Globe, Clock, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Zoom */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slowZoom"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&w=1920&q=80')"}}
        ></div>
        
        {/* Better Overlay for Contrast */}
        <div className="absolute inset-0 bg-slate-900/60"></div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center text-white animate-fadeInUp">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide uppercase">New Routes Available</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-black mb-6 leading-[1.1]">
            Explore the <span className="text-airline-secondary">Skies</span> <br />
            Without Limits
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-200 mb-10 font-light">
            Experience the pinnacle of aviation with SkyLink. We offer seamless booking, 
            premium comfort, and world-class safety for every journey.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              to="/flights" 
              className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-glow"
            >
              Book Your Flight <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/register" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Join SkyLink
            </Link>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<ShieldCheck size={32} />} 
            title="Premium Safety" 
            desc="Global safety certifications for every single fleet member." 
          />
          <FeatureCard 
            icon={<Globe size={32} />} 
            title="Worldwide Network" 
            desc="Direct flights to over 150+ major cities across 6 continents." 
          />
          <FeatureCard 
            icon={<Clock size={32} />} 
            title="Punctual Travel" 
            desc="Ranked #1 for on-time departures in the luxury sector." 
          />
        </div>
      </div>

      {/* --- EXTRA STATS (Adds more content) --- */}
      <div className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">Trusted by Millions</h2>
          <p className="text-slate-600 text-lg mb-12">Building the future of travel with technology and comfort.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-black text-blue-600 mb-1">12M+</div>
              <div className="text-sm uppercase tracking-widest text-slate-400 font-bold">Passengers</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-600 mb-1">150+</div>
              <div className="text-sm uppercase tracking-widest text-slate-400 font-bold">Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-600 mb-1">24/7</div>
              <div className="text-sm uppercase tracking-widest text-slate-400 font-bold">Support</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-600 mb-1">100%</div>
              <div className="text-sm uppercase tracking-widest text-slate-400 font-bold">Eco-Friendly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean code
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:border-blue-300 transition-colors animate-fadeIn">
    <div className="text-blue-600 mb-5 p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors animate-float">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
