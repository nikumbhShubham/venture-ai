import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SignupProps {
  onSwitchToLogin: () => void;
}

// Professional Geometric Particles Component
const GeometricParticles = React.memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate hexagon pattern particles
  const hexagonGrid = [];
  const gridSize = 60;
  const cols = Math.ceil(typeof window !== 'undefined' ? window.innerWidth / gridSize : 1200 / gridSize) + 2;
  const rows = Math.ceil(typeof window !== 'undefined' ? window.innerHeight / gridSize : 800 / gridSize) + 2;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gridSize + (row % 2) * (gridSize / 2);
      const y = row * gridSize * 0.866; // 0.866 = √3/2 for hexagon spacing
      const id = `hex-${row}-${col}`;
      
      hexagonGrid.push({ x, y, id, row, col });
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
          </linearGradient>
          
          <linearGradient id="hexGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.4)" />
          </linearGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          <filter id="pulse" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feFlood floodColor="rgba(139, 92, 246, 0.8)" result="glowColor"/>
            <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow"/>
            <feMerge> 
              <feMergeNode in="softGlow"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Main hexagon grid with optimized rendering */}
        <g>
          {hexagonGrid.map(({ x, y, id, row, col, baseDelay, polygon }) => {
            const distance = Math.sqrt(
              Math.pow(mousePosition.x - x, 2) + Math.pow(mousePosition.y - y, 2)
            );
            const maxDistance = 250;
            const proximity = Math.max(0, 1 - distance / maxDistance);
            const isClose = distance < 120;
            
            return (
              <motion.polygon
                key={id}
                points={polygon}
                initial={{ 
                  opacity: 0, 
                  scale: 0.3,
                  rotate: -180 
                }}
                animate={{ 
                  opacity: proximity * 0.4 + 0.1,
                  scale: proximity * 0.3 + 0.6,
                  rotate: isClose ? proximity * 90 : 0,
                  fill: isClose ? "url(#hexGradientHover)" : "url(#hexGradient)"
                }}
                transition={{ 
                  duration: 0.4,
                  delay: baseDelay,
                  ease: "easeOut"
                }}
                stroke={isClose ? "rgba(139, 92, 246, 0.6)" : "rgba(139, 92, 246, 0.25)"}
                strokeWidth={isClose ? "1.5" : "0.8"}
                filter={isClose ? "url(#pulse)" : "url(#glow)"}
                style={{
                  transformOrigin: `${x}px ${y}px`
                }}
              />
            );
          })}
        </g>
        
        {/* Dynamic connection network - optimized */}
        <g>
          {hexagonGrid
            .filter((_, index) => index % 3 === 0) // Render every 3rd connection for performance
            .map(({ x: x1, y: y1, id }) => {
              const mouseDistance = Math.sqrt(
                Math.pow(mousePosition.x - x1, 2) + Math.pow(mousePosition.y - y1, 2)
              );
              
              if (mouseDistance > 200) return null;
              
              const nearbyParticles = hexagonGrid.filter(({ x: x2, y: y2, id: id2 }) => {
                if (id === id2) return false;
                const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                return distance < 120 && distance > 60;
              }).slice(0, 3); // Limit connections per particle
              
              return nearbyParticles.map(({ x: x2, y: y2, id: id2 }) => {
                const lineDistance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                const opacity = Math.max(0, 1 - mouseDistance / 200) * 0.3;
                
                return (
                  <motion.line
                    key={`${id}-${id2}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(139, 92, 246, 0.4)"
                    strokeWidth="1"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ 
                      opacity,
                      pathLength: opacity > 0 ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                    filter="url(#glow)"
                  />
                );
              });
            })}
        </g>

        {/* Floating accent particles */}
        {[...Array(12)].map((_, i) => (
          <motion.circle
            key={`accent-${i}`}
            cx={100 + i * 120}
            cy={100 + (i % 3) * 200}
            r="3"
            fill="rgba(139, 92, 246, 0.6)"
            initial={{ 
              opacity: 0,
              scale: 0,
              y: 100 + (i % 3) * 200
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
              y: [100 + (i % 3) * 200, 50 + (i % 3) * 200, 0 + (i % 3) * 200]
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            filter="url(#pulse)"
          />
        ))}
      </svg>
    </div>
  );
});

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Full name must be at least 2 characters' : '';
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email' : '';
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain uppercase, lowercase, and number';
        return '';
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
      console.log("Signup Data:", formData);
      setIsLoading(false);
      setStep(2);
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
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative">
        <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${
          focusedField === name ? 'text-indigo-400' : 'text-slate-400'
        }`} />
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          name={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          className={`w-full pl-12 ${showPasswordToggle ? 'pr-14' : 'pr-4'} py-4 bg-slate-800/80 backdrop-blur-xl border transition-all duration-300 rounded-xl text-white placeholder-slate-400 text-base focus:outline-none ${
            errors[name] 
              ? 'border-red-500/50 focus:border-red-400' 
              : focusedField === name 
                ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/20' 
                : 'border-slate-600/30 hover:border-slate-500/50'
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

  if (step === 2) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6">
        {/* Professional Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
          <GeometricParticles />
        </div>
        
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4">Account Created!</h1>
          <p className="text-slate-300 text-lg">Welcome to our platform. You can now start exploring.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <GeometricParticles />
      </div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Marketing Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block text-white space-y-8"
        >
          <div className="space-y-6">
            <motion.h1 
              className="text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-blue-200 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0%", "100%", "0%"] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              Join the Future
            </motion.h1>
            <p className="text-2xl text-slate-300 leading-relaxed">
              Create your account and unlock unlimited possibilities with our cutting-edge platform.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              "Advanced Analytics Dashboard",
              "Real-time Collaboration Tools", 
              "Enterprise-grade Security",
              "24/7 Premium Support"
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-slate-200 text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          {/* Glass Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-blue-500/50 rounded-3xl blur opacity-30"></div>
            <div className="relative backdrop-blur-xl bg-white/5 p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl">
              
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-slate-400">Get started with your free account</p>
              </div>

              <div onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  icon={User}
                  name="name"
                  type="text"
                  placeholder="Full Name"
                />

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
                  placeholder="Create Password"
                  showPasswordToggle={true}
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <div className="text-sm text-slate-400">Password strength:</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const isActive = formData.password.length >= level * 2;
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              isActive 
                                ? level <= 2 ? 'bg-red-500' : level === 3 ? 'bg-yellow-500' : 'bg-green-500'
                                : 'bg-slate-600'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-70 shadow-lg shadow-indigo-500/25 group"
                >
                  <div className="flex items-center justify-center gap-3">
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
                          Creating Account...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <span>Create Account</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600/50"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-transparent text-slate-400">Or continue with</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center px-4 py-3 border border-slate-600/50 rounded-xl bg-slate-800/30 text-white hover:bg-slate-700/50 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center px-4 py-3 border border-slate-600/50 rounded-xl bg-slate-800/30 text-white hover:bg-slate-700/50 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.22.085.342-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.125-2.6 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.307-.744 2.87-.27 1.021-1.002 2.3-1.492 3.078C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z"/>
                    </svg>
                  </motion.button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-slate-400">
                    Already have an account?{" "}
                    <motion.button
                      type="button"
                      onClick={onSwitchToLogin}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                      <Link to="/login">
                      Sign In
                      </Link>
                    </motion.button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;