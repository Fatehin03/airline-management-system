import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Environment } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe, Clock } from "lucide-react";
import * as THREE from "three";

/* ================= 3D AIRPLANE (PREMIUM JET STYLE) ================= */
const Airplane = () => {
  const planeRef = useRef();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const animate = () => {
      start += 0.0018; // smoother flight
      if (start <= 1) {
        setProgress(start);
        requestAnimationFrame(animate);
      } else {
        start = 0; // loop flight like real airline route
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, []);

  useFrame(() => {
    if (planeRef.current) {
      const x = -6 + progress * 12;
      const y = Math.sin(progress * Math.PI) * 1.8;
      const z = -progress * 1.5;

      planeRef.current.position.set(x, y, z);
      planeRef.current.rotation.z = -0.15;
      planeRef.current.rotation.y = Math.PI / 2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={planeRef}>
        {/* Fuselage */}
        <mesh>
          <capsuleGeometry args={[0.18, 2.4, 6, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Main Wings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.2, 0.06, 0.5]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.8} />
        </mesh>

        {/* Tail Wing */}
        <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.9, 0.05, 0.3]} />
          <meshStandardMaterial color="#cbd5f5" metalness={0.8} />
        </mesh>

        {/* Vertical Tail Fin */}
        <mesh position={[0, 0.35, -1.1]}>
          <boxGeometry args={[0.08, 0.6, 0.35]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.7} />
        </mesh>

        {/* Engine Glow (Luxury Effect) */}
        <mesh position={[0.6, -0.1, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    </Float>
  );
};

/* ================= PARALLAX CLOUDS (LUXURY DEPTH) ================= */
const Clouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-10">
      <div className="absolute top-24 left-[-10%] w-[600px] h-56 bg-white/10 blur-3xl rounded-full animate-cloudMove"></div>
      <div className="absolute bottom-20 right-[-10%] w-[700px] h-56 bg-blue-300/10 blur-3xl rounded-full animate-cloudMoveSlow"></div>
    </div>
  );
};

/* ================= WORLD MAP + LIVE ROUTES (AIRLINE STYLE) ================= */
const WorldMapRoutes = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40 z-5"
      viewBox="0 0 1200 600"
    >
      {/* Main Global Route */}
      <path
        d="M 80 420 Q 600 40 1120 320"
        stroke="#3b82f6"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="10 10"
        className="animate-dash"
      />

      {/* Secondary Route */}
      <path
        d="M 150 520 Q 650 180 1050 220"
        stroke="#60a5fa"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 12"
        className="animate-dashSlow"
      />

      {/* Glow Route (Premium Airline Network Effect) */}
      <path
        d="M 200 450 Q 600 120 980 360"
        stroke="#93c5fd"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 10"
        opacity="0.8"
        className="animate-dash"
      />
    </svg>
  );
};

/* ================= MAIN HOME (LUXURY AIRLINE HERO) ================= */
const Home = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <section className="relative h-screen flex items-center justify-center">

        {/* Premium Aviation Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]" />

        {/* World Map Texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Animated Airline Routes */}
        <WorldMapRoutes />

        {/* Parallax Clouds */}
        <Clouds />

        {/* 3D Luxury Scene */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 9] }}>
            <ambientLight intensity={1.8} />
            <directionalLight position={[5, 6, 5]} intensity={2.5} />
            <Environment preset="sunset" />
            <Stars radius={120} depth={60} count={3500} factor={4} fade speed={1.5} />
            <Airplane />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.15} />
          </Canvas>
        </div>

        {/* Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#020617]/80 to-[#020617] z-10" />

        {/* Hero Content (Airline Style) */}
        <div className="relative z-20 text-center px-6 max-w-6xl">
          <div className="inline-block px-6 py-2 mb-6 rounded-full bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 tracking-widest text-sm font-semibold text-blue-300">
            PREMIUM GLOBAL AIRLINES
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            Experience the Future of{" "}
            <span className="text-blue-400 drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]">
              Air Travel
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-12 font-light leading-relaxed">
            Seamless flight management, real-time global routes, and cinematic
            aviation experience designed for next-generation airline systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/flights"
              className="group bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_60px_rgba(59,130,246,0.6)]"
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
