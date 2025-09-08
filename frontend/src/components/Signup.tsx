import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

// --- A more performant, lightweight particle background ---
const ParticlesBackground = React.memo(() => {
    // useMemo will prevent this array from being recalculated on every render
    const particles = useMemo(() => Array.from({ length: 40 }), []);
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Soft, glowing aurora-like shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-[20%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            
            {/* Small, floating particles using CSS for performance */}
            {particles.map((_, i) => {
                const style = {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 20 + 15}s`, // Slower, more subtle
                    animationDelay: `${Math.random() * -35}s`,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                };
                return <div key={i} className="absolute w-1.5 h-1.5 bg-white/10 rounded-full animate-float" style={style}></div>;
            })}
        </div>
    );
});

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState(1);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name': return value.length < 2 ? 'Full name must be at least 2 characters' : '';
      case 'email': return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email' : '';
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password needs uppercase, lowercase, and a number';
        return '';
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if(error) clearError();
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
    await register(formData, () => setStep(2));
  };

  if (step === 2) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <ParticlesBackground />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">Account Created!</h1>
            <p className="text-slate-300 text-lg">Welcome to Venture AI. Your journey starts now.</p>
            <Link to="/dashboard" className="mt-6 inline-block bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-500">
                Go to Dashboard
            </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-900 font-sans">
      <ParticlesBackground />
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:block text-white space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-blue-200 bg-clip-text text-transparent">Join the Future</h1>
          <p className="text-2xl text-slate-300 leading-relaxed">Create your account and unlock the power of AI-driven brand creation.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto lg:mx-0">
          <div className="relative backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">Get started with your free account</p>
            </div>
            <motion.form initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                <input name="name" type="text" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 shadow-lg"/>
                <AnimatePresence>{errors.name && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 mt-2 text-red-400 text-xs"><AlertCircle size={14} />{errors.name}</motion.p>}</AnimatePresence>
              </motion.div>
              <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                <input name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 shadow-lg"/>
                <AnimatePresence>{errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 mt-2 text-red-400 text-xs"><AlertCircle size={14} />{errors.email}</motion.p>}</AnimatePresence>
              </motion.div>
              <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Create Password" required value={formData.password} onChange={handleChange} className="w-full pl-12 pr-12 py-3 bg-slate-800/80 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 shadow-lg" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><AnimatePresence mode="wait">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</AnimatePresence></button>
                <AnimatePresence>{errors.password && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 mt-2 text-red-400 text-xs"><AlertCircle size={14} />{errors.password}</motion.p>}</AnimatePresence>
              </motion.div>
              <AnimatePresence>
                {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"><AlertCircle size={16} />{error}</motion.div>}
              </AnimatePresence>
              <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-70 shadow-lg shadow-indigo-500/25 group">
                  <div className="flex items-center justify-center gap-3">
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </motion.button>
              </motion.div>
              <motion.div variants={{hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}} className="text-center pt-4">
                <p className="text-slate-400">Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign In</Link></p>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

