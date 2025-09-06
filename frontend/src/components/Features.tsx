import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BrainCircuit, Image as ImageIcon, Users, GitMerge, LayoutDashboard, Share2, ArrowRight } from "lucide-react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// --- Reusable Particle Background ---
const ParticlesComponent = React.memo(() => {
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

    if (init) {
        return <Particles id="tsparticles" options={{
             background: { color: { value: "#0a0f1f" } },
             fpsLimit: 60,
             interactivity: {
                 events: {
                     onHover: { enable: true, mode: "repulse" },
                     resize: true,
                 },
                 modes: { repulse: { distance: 80, duration: 0.4 } },
             },
             particles: {
                 color: { value: "#ffffff" },
                 links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 2 },
                 move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 0.5, straight: false },
                 number: { density: { enable: true, area: 800 }, value: 80 },
                 opacity: { value: 0.1 },
                 shape: { type: "circle" },
                 size: { value: { min: 1, max: 3 } },
             },
             detectRetina: true,
        }} />;
    }
    return null;
});

const featureList = [
    {
        icon: BrainCircuit,
        title: "AI Naming & Branding",
        description: "Leverage advanced LLMs to brainstorm creative, memorable, and relevant brand names and stories from a single idea.",
    },
    {
        icon: ImageIcon,
        title: "Multi-Modal Logo Generation",
        description: "Our AI Creative Director writes a detailed brief, then our AI Designer generates a unique, professional logo concept.",
    },
    {
        icon: Users,
        title: "In-Depth Persona Creation",
        description: "Go beyond demographics. Our AI generates detailed customer personas, including motivations, pain points, and lifestyle.",
    },
    {
        icon: GitMerge,
        title: "Seamless Agentic Workflow",
        description: "A team of specialized AI agents collaborates in the background, passing context to ensure a cohesive brand identity.",
    },
    {
        icon: LayoutDashboard,
        title: "Project Dashboard",
        description: "Save, manage, and revisit all your generated brand kits in a clean, intuitive dashboard. Your creative history, all in one place.",
    },
    {
        icon: Share2,
        title: "Export & Share",
        description: "Easily share your generated brand kits with co-founders and investors, or export them for your business plan.",
    },
];

const Features = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0a0f1f] text-white font-sans overflow-hidden">
            <div className="absolute inset-0 z-0">
                <ParticlesComponent />
                {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent "></div> */}
            </div>

            <div className="relative z-10 container mx-auto px-6 py-24 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-purple-300 to-teal-300 bg-clip-text text-transparent tracking-wide"
                >
                    A Creative Agency in Your Pocket
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-6 max-w-3xl mx-auto text-xl text-slate-300 leading-relaxed"
                >
                    Venture AI combines a suite of powerful, specialized AI agents to automate the entire brand creation process, from strategic thinking to visual design.
                </motion.p>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20"
                >
                    {featureList.map((feature, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-lg text-left hover:border-purple-400/50 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-purple-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                 <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-24"
                >
                    <Link to="/signup" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105">
                        Start Your First Project <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Features;

