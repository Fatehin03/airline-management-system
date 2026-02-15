import { Link } from 'react-router-dom';
import { Plane, ShieldCheck, Globe, Clock, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO SECTION ================= */}
      <div className="relative min-h-[90vh] w-full flex flex-col overflow-hidden">

        {/* Background Image (UNCHANGED) */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-slowZoom"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&w=1920&q=80')",
          }}
        />

        {/* Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-[#667eea]/40"></div>

        {/* ================= LUXURY BACKGROUND AIRPLANE ================= */}
        {/* Subtle, cinematic, behind text */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {/* Large Background Plane */}
          <Plane
            size={260}
            className="
              absolute 
              -left-40 
              bottom-10 
              text-white/20 
              animate-takeoff 
              blur-[1px]
              drop-shadow-2xl
            "
          />

          {/* Soft light trail for premium feel */}
          <div className="
            absolute 
            bottom-16 
            left-0 
            w-[500px] 
            h-[2px] 
            bg-gradient-to-r 
            from-white/40 
            via-white/10 
            to-transparent 
            blur-sm
          " />

          {/* Secondary distant plane (depth effect) */}
          <Plane
            size={120}
            className="
              absolute 
              right-20 
              top-32 
              text-white/10 
              animate-float
            "
          />
        </div>

        {/* ================= HERO CONTENT ================= */}
        <div className="relative z-20 flex-grow flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 text-center text-white animate-fadeInUp pt-20">
          
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full mb-6 shadow-xl">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide uppercase">
              Luxury Airline Management System
            </span>
          </div>

          {/* Main Heading (Luxury Style) */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            Elevate Your
            <span className="block gradient-text">
              Aviation Experience
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed">
            A next-generation airline management platform designed for seamless
            flight operations, intelligent booking, and premium passenger
            experience across the globe.
          </p>

          {/* CTA Buttons (UNCHANGED ROUTES) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            <Link
              to="/flights"
              className="btn btn-primary btn-lg flex items-center gap-2"
            >
              Book Your Flight
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/register"
              className="btn btn-secondary btn-lg"
            >
              Join SkyLink
            </Link>
          </div>
        </div>

        {/* ================= FEATURES SECTION ================= */}
        <div className="relative z-30 w-full bg-white/0 -mt-16 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-animation">
              <FeatureCard
                icon={<ShieldCheck size={32} />}
                title="Premium Safety"
                desc="Global safety certifications for every aircraft and flight operation."
              />
              <FeatureCard
                icon={<Globe size={32} />}
                title="Worldwide Network"
                desc="Smart route management covering 150+ international destinations."
              />
              <FeatureCard
                icon={<Clock size={32} />}
                title="Punctual Operations"
                desc="Advanced scheduling system ensuring on-time departures and arrivals."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATS SECTION (UNCHANGED) ================= */}
      <div className="py-20 text-center bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
            Trusted by Millions
          </h2>
          <p className="text-slate-500 text-lg mb-16">
            Building the future of aviation management with innovation and reliability.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem label="Passengers" value="12M+" />
            <StatItem label="Destinations" value="150+" />
            <StatItem label="Support" value="24/7" />
            <StatItem label="Reliability" value="99.9%" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card p-8 flex flex-col items-center text-center">
    <div className="text-[#667eea] mb-5 p-4 bg-[#667eea]/10 rounded-2xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

const StatItem = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <div className="text-4xl font-black text-[#667eea] mb-2 font-display tracking-tight">
      {value}
    </div>
    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-extrabold">
      {label}
    </div>
  </div>
);

export default Home;
