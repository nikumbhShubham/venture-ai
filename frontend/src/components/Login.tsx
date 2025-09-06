import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, Shield, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginProps {
  onSwitchToSignup: () => void;
}

// Corporate Circuit Board Particles Component
const CircuitParticles = React.memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [circuitNodes, setCircuitNodes] = useState<any[]>([]);
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate circuit board pattern
  useEffect(() => {
    const gridSize = 100;
    const cols = Math.ceil(dimensions.width / gridSize) + 1;
    const rows = Math.ceil(dimensions.height / gridSize) + 1;
    const newNodes = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gridSize;
        const y = row * gridSize;
        const id = `node-${row}-${col}`;
        const nodeType = Math.random() > 0.7 ? 'junction' : 'line';
        
        newNodes.push({ 
          x, 
          y, 
          id, 
          row, 
          col,
          type: nodeType,
          baseDelay: (row + col) * 0.02,
          pulseDelay: Math.random() * 4
        });
      }
    }
    
    setCircuitNodes(newNodes);
  }, [dimensions]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.15)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
          </linearGradient>
          
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.9)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.8)" />
          </linearGradient>
          
          <filter id="circuitGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          <filter id="dataFlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="softGlow"/>
            <feFlood floodColor="rgba(34, 197, 94, 1)" result="glowColor"/>
            <feComposite in="glowColor" in2="softGlow" operator="in" result="coloredGlow"/>
            <feMerge> 
              <feMergeNode in="coloredGlow"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Circuit board grid lines */}
        <g>
          {/* Horizontal lines */}
          {[...Array(Math.ceil(dimensions.height / 100))].map((_, i) => (
            <motion.line
              key={`h-line-${i}`}
              x1="0"
              y1={i * 100}
              x2={dimensions.width}
              y2={i * 100}
              stroke="rgba(34, 197, 94, 0.1)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Vertical lines */}
          {[...Array(Math.ceil(dimensions.width / 100))].map((_, i) => (
            <motion.line
              key={`v-line-${i}`}
              x1={i * 100}
              y1="0"
              x2={i * 100}
              y2={dimensions.height}
              stroke="rgba(34, 197, 94, 0.1)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                duration: 2,
                delay: i * 0.1 + 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </g>
        
        {/* Circuit nodes and junctions */}
        <g>
          {circuitNodes.map(({ x, y, id, type, baseDelay, pulseDelay }) => {
            const distance = Math.sqrt(
              Math.pow(mousePosition.x - x, 2) + Math.pow(mousePosition.y - y, 2)
            );
            const isActive = distance < 150;
            
            if (type === 'junction') {
              return (
                <motion.g key={id}>
                  {/* Main junction node */}
                  <motion.rect
                    x={x - 4}
                    y={y - 4}
                    width="8"
                    height="8"
                    rx="2"
                    fill={isActive ? "url(#pulseGradient)" : "url(#circuitGradient)"}
                    stroke="rgba(34, 197, 94, 0.5)"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: isActive ? 1.5 : 1,
                      opacity: 1
                    }}
                    transition={{ 
                      duration: 0.3,
                      delay: baseDelay
                    }}
                    filter={isActive ? "url(#dataFlow)" : "url(#circuitGlow)"}
                  />
                  
                  {/* Pulsing data indicator */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="rgba(34, 197, 94, 0.8)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: pulseDelay,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.g>
              );
            }
            
            return (
              <motion.circle
                key={id}
                cx={x}
                cy={y}
                r="1.5"
                fill={isActive ? "rgba(34, 197, 94, 0.8)" : "rgba(34, 197, 94, 0.3)"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isActive ? 2 : 1,
                  opacity: 1
                }}
                transition={{ 
                  duration: 0.3,
                  delay: baseDelay
                }}
                filter="url(#circuitGlow)"
              />
            );
          })}
        </g>

        {/* Data flow animations */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={`data-${i}`}
            r="3"
            fill="rgba(34, 197, 94, 0.9)"
            filter="url(#dataFlow)"
            initial={{ 
              cx: 0,
              cy: 100 + i * 120,
              opacity: 0
            }}
            animate={{
              cx: [0, dimensions.width],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 4,
              delay: i * 0.7,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </svg>
    </div>
  );
});

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address' : '';
      case 'password':
        return value.length < 1 ? 'Password is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

    setIsLoading(true);
    setTimeout(() => {
      console.log("Login Data:", formData, "Remember Me:", rememberMe);
      setIsLoading(false);
    }, 2000);
  };

  const InputField = ({ 
    icon: Icon, 
    name, 
    type, 
    placeholder, 
    showPasswordToggle = false 
  }: {
    icon: any;
    name: string;
    type: string;
    placeholder: string;
    showPasswordToggle?: boolean;
  }) => (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative">
        <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${
          focusedField === name ? 'text-emerald-400' : 'text-slate-400'
        }`} />
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          name={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          className={`w-full pl-12 ${showPasswordToggle ? 'pr-14' : 'pr-4'} py-4 bg-slate-800/90 backdrop-blur-xl border transition-all duration-300 rounded-xl text-white placeholder-slate-400 text-base focus:outline-none ${
            errors[name] 
              ? 'border-red-500/50 focus:border-red-400' 
              : focusedField === name 
                ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                : 'border-slate-600/40 hover:border-slate-500/60'
          }`}
          required
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors z-10"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {errors[name] && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 mt-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
          >
            <AlertCircle className="w-4 h-4" />
            {errors[name]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* Corporate Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900">
        <CircuitParticles />
      </div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.03)_1px,_transparent_0)] bg-[length:50px_50px] opacity-30"></div>

      {/* Main Container - Centered single column layout */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-2xl blur opacity-60"></div>
          <div className="relative backdrop-blur-2xl bg-slate-900/70 p-8 rounded-2xl border border-emerald-500/20 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Welcome Back
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400 text-lg"
              >
                Sign in to your account
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <InputField
                icon={Mail}
                name="email"
                type="email"
                placeholder="Email Address"
              />

              <InputField
                icon={Lock}
                name="password"
                type="password"
                placeholder="Password"
                showPasswordToggle={true}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <motion.label 
                  className="flex items-center gap-2 text-slate-300 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  Remember me
                </motion.label>
                <motion.button
                  type="button"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Forgot password?
                </motion.button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-70 shadow-lg shadow-emerald-500/25 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Signing In...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-transparent text-slate-400">Quick Access</span>
                </div>
              </div>

              {/* Quick Access Options */}
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 border border-slate-600/50 rounded-xl bg-slate-800/40 text-white hover:bg-slate-700/50 transition-all duration-300 group"
                >
                  <Zap className="w-6 h-6 mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">SSO</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 border border-slate-600/50 rounded-xl bg-slate-800/40 text-white hover:bg-slate-700/50 transition-all duration-300 group"
                >
                  <Shield className="w-6 h-6 mb-2 text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">2FA</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 border border-slate-600/50 rounded-xl bg-slate-800/40 text-white hover:bg-slate-700/50 transition-all duration-300 group"
                >
                  <Users className="w-6 h-6 mb-2 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Guest</span>
                </motion.button>
              </div>

              {/* Signup Link */}
              <div className="text-center pt-6">
                <p className="text-slate-400">
                  Don't have an account?{" "}
                  <motion.button
                    type="button"
                    onClick={onSwitchToSignup}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  >
                    <Link to="/signup">
                    Create Account
                    </Link>
                  </motion.button>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-600/30">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-300">Secured with enterprise-grade encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;