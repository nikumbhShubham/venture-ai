import React from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Github, Twitter, Linkedin, ArrowUpCircle } from "lucide-react";

const Footer = () => {
    const footerLinks = {
        product: [
            { name: "Features", to: "features" },
            { name: "Pricing", to: "pricing" },
            { name: "Testimonials", to: "testimonials" },
        ],
        company: [
            { name: "About Us", to: "/about" },
            { name: "Careers", to: "/careers" },
            { name: "Contact", to: "/contact" },
        ],
        legal: [
            { name: "Privacy Policy", to: "/privacy" },
            { name: "Terms of Service", to: "/terms" },
        ],
    };

    const socialLinks = [
        { icon: Github, href: "https://github.com" },
        { icon: Twitter, href: "https://twitter.com" },
        { icon: Linkedin, href: "https://linkedin.com" },
    ];
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <footer className="relative w-full  text-slate-300 font-sans pt-24 pb-8 border-t border-slate-800 overflow-hidden">
             <div className="absolute inset-0 z-0">
                {/* Background Glows */}
                <div className="absolute -top-24 left-0 w-1/2 h-64 bg-indigo-900/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -top-24 right-0 w-1/2 h-64 bg-purple-900/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>
            <div className="relative z-10 container mx-auto px-6">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
                >
                    {/* Logo & Tagline */}
                    <motion.div variants={itemVariants} className="col-span-2 lg:col-span-2 pr-8">
                        <h2 className="text-3xl font-bold text-white tracking-wide">
                            Venture <span className="text-purple-400">AI</span>
                        </h2>
                        <p className="mt-4 text-slate-400 leading-relaxed max-w-xs">
                            Your AI-powered brand strategist. Instantly generate a complete brand identity from a single idea.
                        </p>
                        <div className="mt-6 flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a 
                                    key={index} 
                                    href={social.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, color: '#c4b5fd' }}
                                    className="text-slate-400"
                                >
                                    <social.icon className="w-6 h-6" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links */}
                    <motion.div variants={itemVariants}>
                        <h4 className="font-semibold text-white mb-4 tracking-wider">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map(link => (
                                <li key={link.name}>
                                    <ScrollLink to={link.to} spy={true} smooth={true} duration={500} offset={-70} className="hover:text-purple-300 transition-colors cursor-pointer">{link.name}</ScrollLink>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h4 className="font-semibold text-white mb-4 tracking-wider">Company</h4>
                         <ul className="space-y-3">
                            {footerLinks.company.map(link => (
                                <li key={link.name}><RouterLink to={link.to} className="hover:text-purple-300 transition-colors">{link.name}</RouterLink></li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <h4 className="font-semibold text-white mb-4 tracking-wider">Legal</h4>
                         <ul className="space-y-3">
                            {footerLinks.legal.map(link => (
                                <li key={link.name}><RouterLink to={link.to} className="hover:text-purple-300 transition-colors">{link.name}</RouterLink></li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Venture AI. All rights reserved.
                    </p>
                    <motion.button 
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.05, color: '#fff' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-slate-400 mt-4 sm:mt-0"
                    >
                        Back to Top <ArrowUpCircle className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

