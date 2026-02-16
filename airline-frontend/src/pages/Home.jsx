import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe, Clock } from "lucide-react";
import Lottie from "lottie-react";
import airplaneAnimation from "../assets/airplane.json";

/* ================= PREMIUM AIRPLANE (REALISTIC LOTTIE) ================= */
const Airplane = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="w-[420px] md:w-[650px] lg:w-[800px] opacity-95 
      drop-shadow-[0_20px_80px_rgba(59,130,246,0.6)]">
        <Lottie
          animationData={airplaneAnimation}
          loop={true}
        />
      </div>
    </div>
  );
};

/* ================= PARALLAX CLOUDS (LUXURY DEPTH) ================= */
const Clouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-5">
      <div className="absolute top-16 left-[-10%] w-[500px] h-40 bg-white/20 blur-3xl rounded-full animate-[cloudMove_80s_linear_infinite]" />
      <div className="absolute bottom-20 right-[-10%] w-[600px] h-48 bg-blue-200/20 blur-3xl rounded-full animate-[cloudMoveSlow_120s_linear_infinite]" />
    </div>
  );
};

/* ================= WORLD MAP + PREMIUM ROUTES ================= */
const WorldMapRoutes = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40 z-0"
      viewBox="0 0 1200 600"
    >
      {/* Main Global Route */}
      <path
        d="M 50 420 Q 600 50 1150 350"
        stroke="#60a5fa"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="10 8"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="1000"
          to="0"
          dur="18s"
          repeatCount="indefinite"
        />
      </path>

      {/* Secondary Route */}
      <path
        d="M 150 500 Q 700 120 1050 220"
        stroke="#38bdf8"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 10"
        opacity="0.8"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="800"
          to="0"
          dur="22s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

/* ================= MAIN HOME (LUXURY AIRLINE HERO) ================= */
const Home = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen flex items-center justify-center">

        {/* Luxury Sky + World Map Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1920')",
          }}
        />

        {/* Glow Gradient Overlay (Airline Premium Style) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/70 to-[#020617] z-0" />

        {/* Animated Flight Routes */}
        <WorldMapRoutes />

        {/* Parallax Clouds */}
        <Clouds />

        {/* Subtle Stars for Depth */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Stars
              radius={100}
              depth={50}
              count={3000}
              factor={3}
              fade
              speed={1.5}
            />
          </Canvas>
        </div>

        {/* REALISTIC AIRPLANE (CENTER HERO) */}
        <Airplane />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl">
          <div className="inline-block px-6 py-2 mb-6 rounded-full 
          bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 
          tracking-widest text-sm text-blue-300">
            SKYLINK LUXURY AIRLINES
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            Experience the Future of{" "}
            <span className="text-blue-400 drop-shadow-[0_0_30px_rgba(96,165,250,0.8)]">
              Air Travel
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-12 font-light">
            Premium airline management with cinematic UI, real-time global routes,
            and next-generation aviation experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/flights"
              className="group bg-blue-600 hover:bg-blue-700 
              px-10 py-4 rounded-2xl font-bold text-lg 
              flex items-center gap-2 transition-all 
              hover:scale-105 shadow-[0_0_50px_rgba(59,130,246,0.6)]"
            >
              Explore Flights
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition"
              />
            </Link>

            <Link
              to="/register"
              className="bg-white/10 backdrop-blur-xl border border-white/20 
              px-10 py-4 rounded-2xl font-bold text-lg 
              hover:bg-white/20 transition-all"
            >
              Join SkyLink
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM FEATURES SECTION ===== */}
      <section className="py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<ShieldCheck size={32} />}
            title="Luxury Safety"
            desc="Aviation-grade security and world-class passenger safety systems."
          />
          <FeatureCard
            icon={<Globe size={32} />}
            title="Global Network"
            desc="Seamless connections to 150+ international destinations."
          />
          <FeatureCard
            icon={<Clock size={32} />}
            title="Smart Scheduling"
            desc="AI-powered flight scheduling with precision timing."
          />
        </div>
      </section>
    </div>
  );
};

/* ================= FEATURE CARD ================= */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-2xl 
  p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 
  shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center">
    <div className="text-blue-400 mb-5 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default Home;
