import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe, Clock } from "lucide-react";
import * as THREE from "three";

/* ================= 3D AIRPLANE (Realistic Jet Shape) ================= */
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
      // Banking rotation logic
      planeRef.current.rotation.z = -0.3; 
      planeRef.current.rotation.y = Math.PI / 2; // Face forward
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={planeRef}>
        {/* Fuselage (Main Body) */}
        <mesh>
          <capsuleGeometry args={[0.15, 1.8, 4, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Main Wings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.6, 0.05, 0.4]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} />
        </mesh>
        {/* Tail Fins */}
        <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.6, 0.05, 0.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, -0.75]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.02, 0.3, 0.2]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
    </Float>
  );
};

/* ================= PARALLAX CLOUDS ================= */
const Clouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-10">
      <div className="absolute top-20 left-0 w-96 h-40 bg-white/40 blur-3xl rounded-full animate-cloudMove"></div>
      <div className="absolute bottom-20 right-0 w-[500px] h-40 bg-blue-200/30 blur-3xl rounded-full animate-cloudMoveSlow"></div>
    </div>
  );
};

/* ================= WORLD MAP + ROUTES ================= */
const WorldMapRoutes = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40 z-5"
      viewBox="0 0 1200 600"
    >
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
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen flex items-center justify-center">

        {/* Bright Sky Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1920')",
          }}
        />

        {/* Animated Routes */}
        <WorldMapRoutes />

        {/* Parallax Clouds */}
        <Clouds />

        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <Environment preset="city" />
            <Airplane />
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Canvas>
        </div>

        {/* Bright Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-50 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl">
          <div className="inline-block px-6 py-2 mb-6 rounded-full bg-blue-600/10 backdrop-blur-md border border-blue-400/20 tracking-widest text-sm text-blue-700 font-bold">
            GLOBAL LUXURY AIRLINES
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 text-slate-900">
            Fly Across the <span className="text-blue-600">World</span> in Luxury
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 font-medium">
            Experience cinematic airline booking with real-time routes,
            3D flight animation, and next-generation luxury UI design.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/flights"
              className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
            >
              Explore Flights
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/register"
              className="bg-white text-blue-600 border border-blue-100 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-md"
            >
              Join SkyLink
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM FEATURES ===== */}
      <section className="py-24 bg-white">
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
  <div className="bg-slate-50 border border-slate-200 p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 shadow-lg text-center">
    <div className="text-blue-600 mb-5 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-bold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-500 font-medium">{desc}</p>
  </div>
);

export default Home;
