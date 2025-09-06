import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // simple icons
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ["Features", "Pricing", "Testimonials"];

  return (
    <section className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <p className="text-2xl font-bold text-white tracking-wide">
          Venture <span className="text-purple-400">AI</span>
        </p>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-slate-300 font-medium">
          {navItems.map((item, i) => (
            <motion.div
              key={i}
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="group-hover:text-white transition-colors duration-200">
                {item}
              </p>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </motion.div>
          ))}
        </div>

        {/* Buttons Desktop */}
        <div className="hidden md:flex items-center space-x-5">
          <Link to="/login" className="px-4 py-2 border border-slate-500 rounded-xl text-slate-300 hover:text-white hover:border-purple-400 transition-colors duration-300 cursor-pointer">
            Login
          </Link>
          <Link to="/signup" className="px-5 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors duration-300 shadow-md cursor-pointer">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-background/90 backdrop-blur-md shadow-lg"
        >
          <div className="flex flex-col items-center space-y-6 py-6 text-slate-300">
            {navItems.map((item, i) => (
              <p
                key={i}
                className="hover:text-white cursor-pointer text-lg"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </p>
            ))}
            <div className="flex flex-col space-y-4 w-full px-6">
              <button className="px-4 py-2 border border-slate-500 rounded-xl text-slate-300 hover:text-white hover:border-purple-400 transition-colors duration-300">
                Login
              </button>
              <button className="px-5 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors duration-300 shadow-md">
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Navbar;
