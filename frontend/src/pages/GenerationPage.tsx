import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBrandKitStore } from '../stores/useBrandKitStore.ts'; // Corrected import
import { BrainCircuit, ArrowRight, Loader } from 'lucide-react';

const GenerationPage: React.FC = () => {
    const [businessIdea, setBusinessIdea] = useState('');
    const { startGeneration, isLoading } = useBrandKitStore();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessIdea.trim() || isLoading) return;
        startGeneration(businessIdea, navigate);
    };

    return (
        <div className="min-h-screen bg-[#0a0f1f] text-slate-200 font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-3xl mx-auto text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                    <BrainCircuit size={64} className="mx-auto text-purple-400 mb-6" />
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-extrabold text-white"
                >
                    Describe Your Vision
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-lg text-slate-400"
                >
                    Enter your business idea below. Be as simple or as detailed as you like. Our AI agency will do the rest.
                </motion.p>
                
                <form onSubmit={handleSubmit}>
                    <motion.textarea
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full h-40 p-4 mt-10 text-lg bg-slate-800/50 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-200 resize-none transition-colors"
                        placeholder="e.g., A subscription box for artisanal, single-origin coffee beans, delivered in Pune and Mumbai."
                        value={businessIdea}
                        onChange={(e) => setBusinessIdea(e.target.value)}
                    />
                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="mt-8 w-full flex items-center justify-center gap-3 bg-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors text-xl shadow-lg shadow-purple-500/30 disabled:opacity-70 group"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                Generate Brand Kit
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default GenerationPage;

