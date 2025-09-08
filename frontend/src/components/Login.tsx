import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

// --- Reusable Particle Background (same as Signup) ---
const ParticlesBackground = React.memo(() => {
    const particles = useMemo(() => Array.from({ length: 40 }), []);
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-[20%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            {particles.map((_, i) => {
                const style = {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 20 + 15}s`,
                    animationDelay: `${Math.random() * -35}s`,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                };
                return <div key={i} className="absolute w-1.5 h-1.5 bg-white/10 rounded-full animate-float" style={style}></div>;
            })}
        </div>
    );
});

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'email': return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email' : '';
            case 'password': return value.length < 1 ? 'Password is required' : '';
            default: return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (error) clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        await login(formData, navigate);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-900 font-sans">
            <ParticlesBackground />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:block text-white space-y-8">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-blue-200 bg-clip-text text-transparent">Welcome Back</h1>
                    <p className="text-2xl text-slate-300 leading-relaxed">Sign in to continue your journey and access your personalized AI branding dashboard.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="relative backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                            <p className="text-slate-400">Enter your credentials to continue</p>
                        </div>
                        <motion.form variants={{hidden: {}, visible: {transition: {staggerChildren: 0.1}}}} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
                            <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                <input name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 shadow-lg"/>
                                <AnimatePresence>{errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 mt-2 text-red-400 text-xs"><AlertCircle size={14} />{errors.email}</motion.p>}</AnimatePresence>
                            </motion.div>
                            <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full pl-12 pr-12 py-3 bg-slate-800/80 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 shadow-lg" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><AnimatePresence mode="wait">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</AnimatePresence></button>
                                <AnimatePresence>{errors.password && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 mt-2 text-red-400 text-xs"><AlertCircle size={14} />{errors.password}</motion.p>}</AnimatePresence>
                            </motion.div>
                            <AnimatePresence>
                                {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"><AlertCircle size={16} />{error}</motion.div>}
                            </AnimatePresence>
                            <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}}>
                                <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-70 shadow-lg shadow-indigo-500/25 group">
                                    <div className="flex items-center justify-center gap-3">
                                      {isLoading ? "Signing In..." : "Sign In"}
                                      {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </div>
                                </motion.button>
                            </motion.div>
                            <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="text-center pt-4">
                                <p className="text-slate-400">Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign Up</Link></p>
                            </motion.div>
                        </motion.form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
