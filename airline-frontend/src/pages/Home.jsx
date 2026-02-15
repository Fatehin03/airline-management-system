import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe, Clock } from "lucide-react";
import * as THREE from "three";

/* ================= 3D AIRPLANE ================= */
const Airplane = () => {
  const planeRef = useRef();
  const [progress, setProgress] = useState(0);

  // Auto flight animation on load
  useEffect(() => {
    let start = 0;
    const animate = () => {
      start += 0.002;
      if (start <= 1) {
        setProgress(start);
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, []);

  useFrame(() => {
    if (planeRef.current) {
      const x = -5 + progress * 10;
      const y = Math.sin(progress * Math.PI) * 1.5;
      const z = 0;
      planeRef.current.position.set(x, y, z);
      planeRef.current.rotation.z = -0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={planeRef}>
        <coneGeometry args={[0.2, 1.5, 16]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.2} />
      </mesh>
    </Float>
  );
};

/* ================= PARALLAX CLOUDS ================= */
const Clouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-10">
      <div className="absolute top-20 left-0 w-96 h-40 bg-white/10 blur-3xl rounded-full animate-cloudMove"></div>
      <div className="absolute bottom-20 right-0 w-[500px] h-40 bg-blue-300/10 blur-3xl rounded-full animate-cloudMoveSlow"></div>
    </div>
  );
};

/* ================= WORLD MAP + ROUTES ================= */
const WorldMapRoutes = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30 z-5"
      viewBox="0 0 1200 600"
    >
      {/* Curved Flight Routes */}
      <path
        d="M 100 400 Q 600 50 1100 350"
        stroke="#3b82f6"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 8"
        className="animate-dash"
      />
      <path
        d="M 200 500 Q 700 150 1000 200"
        stroke="#60a5fa"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 10"
        className="animate-dashSlow"
      />
    </svg>
  );
};

/* ================= MAIN HOME ================= */
const Home = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen flex items-center justify-center">

        {/* World Map Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1920')",
          }}
        />

        {/* Animated Routes */}
        <WorldMapRoutes />

        {/* Parallax Clouds */}
        <Clouds />

        {/* Particles / Stars */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <Stars radius={100} depth={50} count={4000} factor={4} fade speed={2} />
            <Airplane />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Canvas>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#020617]/80 to-[#020617] z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl">
          <div className="inline-block px-6 py-2 mb-6 rounded-full bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 tracking-widest text-sm">
            GLOBAL LUXURY AIRLINES
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            Fly Across the <span className="text-blue-400">World</span> in Luxury
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-12 font-light">
            Experience cinematic airline booking with real-time routes,
            3D flight animation, and next-generation luxury UI design.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/flights"
              className="group bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.6)]"
            >
              Explore Flights
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/register"
              className="bg-white/10 backdrop-blur-xl border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              Join SkyLink
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM FEATURES ===== */}
      <section className="py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<ShieldCheck size={32} />}
            title="Luxury Safety"
            desc="Advanced aviation-grade security and safety systems."
          />
          <FeatureCard
            icon={<Globe size={32} />}
            title="Global Network"
            desc="Fly to 150+ elite destinations worldwide seamlessly."
          />
          <FeatureCard
            icon={<Clock size={32} />}
            title="Smart Scheduling"
            desc="AI-powered punctual flights with premium comfort."
          />
        </div>
      </section>
    </div>
  );
};

/* ================= FEATURE CARD ================= */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center">
    <div className="text-blue-400 mb-5 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default Home;
