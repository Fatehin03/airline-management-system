import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe, Clock } from "lucide-react";
import * as THREE from "three";

/* ================= 3D LUXURY AIRPLANE (REAL LOOK) ================= */
const Airplane = () => {
  const planeRef = useRef();
  const trailRef = useRef();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const animate = () => {
      start += 0.0018;
      if (start <= 1) {
        setProgress(start);
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, []);

  useFrame(() => {
    if (planeRef.current) {
      const x = -6 + progress * 12;
      const y = Math.sin(progress * Math.PI) * 2;
      const z = Math.sin(progress * Math.PI) * -1.5;

      planeRef.current.position.set(x, y, z);
      planeRef.current.rotation.y = -Math.PI / 2;
      planeRef.current.rotation.z = -0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={planeRef}>
        {/* Fuselage (Main Body - Realistic) */}
        <mesh>
          <cylinderGeometry args={[0.18, 0.22, 3.5, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={1}
            roughness={0.15}
            emissive="#1e3a8a"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0, 1.9]}>
          <coneGeometry args={[0.22, 0.8, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.2} />
        </mesh>

        {/* Wings */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[4, 0.08, 0.8]} />
          <meshStandardMaterial
            color="#2563eb"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Tail Wing */}
        <mesh position={[0, 0.6, -1.5]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[1.2, 0.08, 0.5]} />
          <meshStandardMaterial color="#1e40af" metalness={1} />
        </mesh>

        {/* Vertical Tail */}
        <mesh position={[0, 0.8, -1.6]}>
          <boxGeometry args={[0.15, 1, 0.6]} />
          <meshStandardMaterial color="#1e3a8a" metalness={1} />
        </mesh>

        {/* Engine Left */}
        <mesh position={[-1.2, -0.3, 0.3]}>
          <cylinderGeometry args={[0.35, 0.35, 0.9, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.3} />
        </mesh>

        {/* Engine Right */}
        <mesh position={[1.2, -0.3, 0.3]}>
          <cylinderGeometry args={[0.35, 0.35, 0.9, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.3} />
        </mesh>

        {/* Glow Light */}
        <pointLight color="#60a5fa" intensity={2} distance={10} />
      </group>
    </Float>
  );
};

/* ================= LUXURY CLOUDS ================= */
const Clouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-10">
      <div className="absolute top-24 left-0 w-[500px] h-40 bg-blue-400/20 blur-3xl rounded-full animate-cloudMove"></div>
      <div className="absolute bottom-24 right-0 w-[600px] h-48 bg-indigo-400/20 blur-3xl rounded-full animate-cloudMoveSlow"></div>
    </div>
  );
};

/* ================= GLOWING WORLD ROUTES ================= */
const WorldMapRoutes = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40 z-5"
      viewBox="0 0 1200 600"
    >
      <path
        d="M 80 420 Q 600 40 1120 350"
        stroke="url(#grad1)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="10 10"
      />
      <path
        d="M 150 520 Q 700 180 1050 220"
        stroke="#60a5fa"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
      />

      <defs>
        <linearGradient id="grad1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ================= MAIN HOME ================= */
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#020617] to-[#000814] text-white overflow-hidden">
      <section className="relative h-screen flex items-center justify-center">

        {/* Bright Luxury Sky Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920')",
          }}
        />

        <WorldMapRoutes />
        <Clouds />

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 1, 8] }}>
            <ambientLight intensity={2.5} />
            <directionalLight position={[5, 5, 5]} intensity={3} />
            <pointLight position={[0, 3, 2]} intensity={4} color="#60a5fa" />
            <Stars radius={120} depth={60} count={5000} factor={5} fade speed={2} />
            <Airplane />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.4}
            />
          </Canvas>
        </div>

        {/* Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#020617]/70 to-[#020617] z-10" />

        {/* HERO CONTENT */}
        <div className="relative z-20 text-center px-6 max-w-6xl">
          <div className="inline-block px-8 py-3 mb-8 rounded-full bg-blue-500/10 backdrop-blur-xl border border-blue-400/30 tracking-widest text-sm shadow-lg">
            SKYLINK PREMIUM AIRLINES
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            Fly Beyond the <span className="text-blue-400">Clouds</span> in Luxury
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-12 font-light">
            Experience next-generation airline booking with cinematic 3D flights,
            global routes, and a premium luxury interface designed for modern travelers.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/flights"
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 px-12 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_60px_rgba(59,130,246,0.8)]"
            >
              Explore Flights
              <ArrowRight size={22} className="group-hover:translate-x-2 transition" />
            </Link>

            <Link
              to="/register"
              className="bg-white/10 backdrop-blur-2xl border border-white/20 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all shadow-xl"
            >
              Join SkyLink
            </Link>
          </div>
        </div>
      </section>

      {/* PREMIUM FEATURES */}
      <section className="py-24 bg-gradient-to-b from-[#020617] to-[#020617]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<ShieldCheck size={34} />}
            title="Luxury Safety"
            desc="Aviation-grade security with premium passenger protection."
          />
          <FeatureCard
            icon={<Globe size={34} />}
            title="Global Network"
            desc="Seamless travel to 150+ elite destinations worldwide."
          />
          <FeatureCard
            icon={<Clock size={34} />}
            title="Smart Scheduling"
            desc="AI-optimized flight timing for maximum comfort and punctuality."
          />
        </div>
      </section>
    </div>
  );
};

/* ================= FEATURE CARD ================= */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 shadow-[0_30px_80px_rgba(0,0,0,0.7)] text-center">
    <div className="text-blue-400 mb-6 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-300">{desc}</p>
  </div>
);

export default Home;
