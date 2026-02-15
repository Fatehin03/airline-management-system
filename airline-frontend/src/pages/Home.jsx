import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe, Clock } from "lucide-react";

/* ================= 3D JET PLANE ================= */
const Airplane = () => {
  const planeRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (planeRef.current) {
      // Gentle floating and banking animation
      planeRef.current.position.y = Math.sin(t * 0.5) * 0.2;
      planeRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
      planeRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={planeRef} rotation={[0, -Math.PI / 2, 0]}>
        {/* Modern Jet Fuselage using Capsule Geometry */}
        <capsuleGeometry args={[0.18, 2, 4, 16]} />
        <meshStandardMaterial 
            color="#3b82f6" 
            metalness={0.8} 
            roughness={0.2} 
            envMapIntensity={1}
        />
        {/* Simple Wings (Optional extra detail) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.4]} />
            <meshStandardMaterial color="#2563eb" metalness={0.8} />
        </mesh>
      </mesh>
    </Float>
  );
};

/* ================= MAIN HOME ================= */
const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        
        {/* Bright Sky Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1920')"}}
        />

        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <spotLight position={[-5, 5, 5]} angle={0.3} intensity={1} />
            
            {/* Realistic Lighting Environment */}
            <Environment preset="city" />
            
            <Airplane />
            
            {/* Soft Shadow on the 'floor' */}
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        {/* Soft White Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-slate-50 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl animate-fadeInUp mt-10">
          <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-md border border-blue-200 px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest text-blue-700 uppercase">Premium Aviation</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 text-slate-900 drop-shadow-sm">
            Reach New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Heights</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 font-medium leading-relaxed">
            Experience the future of travel. Seamless booking, 
            luxury comfort, and AI-driven precision on every flight.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/flights"
              className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1"
            >
              Book Your Flight
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/register"
              className="bg-white/80 backdrop-blur-md text-blue-700 border border-blue-100 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all shadow-lg shadow-slate-200/50 hover:-translate-y-1"
            >
              Join SkyLink
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION (Clean Light Theme) ===== */}
      <section className="relative z-30 py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Fly SkyLink?</h2>
             <p className="text-slate-500 mt-4">We redefine the standards of modern aviation.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck size={32} />}
              title="Certified Safety"
              desc="Exceeding international safety standards on every single route."
            />
            <FeatureCard
              icon={<Globe size={32} />}
              title="150+ Destinations"
              desc="Connecting you to the world’s most iconic cities effortlessly."
            />
            <FeatureCard
              icon={<Clock size={32} />}
              title="Real-time Data"
              desc="Live tracking and AI-powered scheduling for total punctuality."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= FEATURE CARD COMPONENT ================= */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group cursor-default">
    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Home;
