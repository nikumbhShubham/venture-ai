import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber"; //
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Features from "./Features";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

function ParticlesV() {
  const ref = useRef<THREE.Points>(null);

  const { positions, targetPositions } = useMemo(() => {
    const numParticles = 9000;
    const tempStart = new Float32Array(numParticles * 3);
    const tempTarget = new Float32Array(numParticles * 3);
    const width = 6,
      height = 8,
      thickness = 1.9;

    for (let i = 0; i < numParticles; i++) {
      tempStart[i * 3] = (Math.random() - 0.5) * 15;
      tempStart[i * 3 + 1] = (Math.random() - 0.5) * 15;
      tempStart[i * 3 + 2] = (Math.random() - 0.5) * 5;

      const t = Math.random();
      if (i < numParticles / 2) {
        const centerX = -width + t * width;
        const centerY = 0 - t * height;
        tempTarget[i * 3] = centerX + (Math.random() - 0.5) * thickness;
        tempTarget[i * 3 + 1] = centerY + (Math.random() - 0.5) * thickness;
        tempTarget[i * 3 + 2] = (Math.random() - 0.5) * thickness;
      } else {
        const centerX = 0 + t * width;
        const centerY = -height + t * height;
        tempTarget[i * 3] = centerX + (Math.random() - 0.5) * thickness;
        tempTarget[i * 3 + 1] = centerY + (Math.random() - 0.5) * thickness;
        tempTarget[i * 3 + 2] = (Math.random() - 0.5) * thickness;
      }
    }
    return { positions: tempStart, targetPositions: tempTarget };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < arr.length; i += 3) {
      const ix = i,
        iy = i + 1,
        iz = i + 2;

      // Move toward target
      arr[ix] += (targetPositions[ix] - arr[ix]) * 0.02;
      arr[iy] += (targetPositions[iy] - arr[iy]) * 0.02;
      arr[iz] += (targetPositions[iz] - arr[iz]) * 0.02;

      // Add "breathing" noise movement
      arr[ix] += Math.sin(time * 1.5 + i) * 0.005;
      arr[iy] += Math.cos(time * 1.2 + i * 0.3) * 0.005;
      arr[iz] += Math.sin(time + i * 0.5) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Animate particle material opacity (blinking glow)
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 0.9 + Math.sin(time * 2) * 0.3;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#800080"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </Points>
  );
}

// --- Component for the Ambient "Stardust" ---
function Stardust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const numParticles = 8000;
    const arr = new Float32Array(numParticles * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state: RootState, delta: number) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#9D00FF"
        size={0.013}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// --- Main Scene Component to handle mouse interaction and rotation ---
function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state: RootState, delta: number) => {
    if (groupRef.current) {
      // Continuous slow rotation
      groupRef.current.rotation.y += delta * 0.05;

      // Responsive tilt based on mouse position (easing)
      const targetRotationX = mouse.current[1] * 0.1;
      const targetRotationY = mouse.current[0] * 0.1;

      groupRef.current.rotation.x +=
        (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y +=
        (targetRotationY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      <ParticlesV />
      <Stardust />
    </group>
  );
}

// --- Final Hero Section Component ---
const HeroSection = () => {
  return (
    <section>

    <div className="relative w-full h-screen bg-[#080f25] overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Particles/3D Scene */}
      <Canvas
        className="absolute inset-0 z-10"
        camera={{ position: [0, 0, 10], fov: 75 }}
      >
        <ambientLight intensity={1.5} />
        <Scene />
      </Canvas>

      {/* Hero Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-9xl font-extrabold tracking-tight 
             bg-gradient-to-r from-indigo-200 via-purple-300 to-blue-200 
             bg-clip-text text-transparent"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          VENTURE AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 text-lg md:text-2xl text-slate-50 font-medium max-w-2xl"
        >
          Your AI-Powered Brand Strategist. <br />
          Turn ideas into stunning brands in seconds.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <button className="px-6 py-3 rounded-xl bg-purple-500/80 text-white font-semibold shadow-lg hover:bg-purple-600/90 hover:scale-105 transition transform backdrop-blur-md cursor-pointer">
          <Link to="/signup">
            Get Started for Free
          </Link>
          </button>
          <button className="px-6 py-3 rounded-xl border border-purple-400 text-white font-semibold shadow-md hover:bg-purple-400/20 hover:scale-105 transition transform backdrop-blur-md cursor-pointer">
            See Examples
          </button>
        </motion.div>
      </div>
    </div>
       <Features/>
       <Pricing/>
       <Testimonials/>
       <Footer/>
    </section>

  );  
};

export default HeroSection;
