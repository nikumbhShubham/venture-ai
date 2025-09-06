import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

// Pricing data
const pricingPlans = [
    {
        name: "Hobby",
        price: { monthly: 0, yearly: 0 },
        description: "For personal projects and exploring the platform.",
        features: [
            "5 Brand Kit Generations",
            "Basic Logo Concepts",
            "Save up to 3 Projects",
            "Community Support",
        ],
        cta: "Start for Free",
        isFeatured: false,
    },
    {
        name: "Pro",
        price: { monthly: 29, yearly: 290 },
        description: "For freelancers and professionals who need to move fast.",
        features: [
            "50 Brand Kit Generations per Month",
            "Advanced Logo Concepts (HD)",
            "Unlimited Project Saving",
            "Exportable Brand Guides (PDF)",
            "Priority Email Support",
        ],
        cta: "Choose Pro",
        isFeatured: true,
    },
    {
        name: "Enterprise",
        price: { monthly: "Custom", yearly: "Custom" },
        description: "For agencies and teams requiring advanced collaboration.",
        features: [
            "Unlimited Generations",
            "Team Collaboration Tools",
            "Custom AI Model Training",
            "Dedicated Account Manager",
            "API Access",
        ],
        cta: "Contact Sales",
        isFeatured: false,
    },
];

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div id="pricing" className="relative w-full text-white font-sans py-24 sm:py-32">
            <div className="absolute inset-0 z-0">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
            </div>
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-slate-300 to-purple-300 bg-clip-text text-transparent"
                >
                    Find the Perfect Plan
                </motion.h2>
                <motion.p 
                     initial={{ opacity: 0, y: -10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, amount: 0.5 }}
                     transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 max-w-2xl mx-auto text-lg text-slate-400"
                >
                    Start for free and scale as you grow. All plans include access to our powerful AI creative engine.
                </motion.p>

                {/* Billing Cycle Toggle */}
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, amount: 0.5 }}
                     transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 flex justify-center items-center gap-4"
                >
                    <span className={`font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
                    <div 
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className={`w-14 h-8 flex items-center bg-slate-700 rounded-full p-1 cursor-pointer transition-colors ${billingCycle === 'yearly' ? 'justify-end' : 'justify-start'}`}
                    >
                        <motion.div 
                            layout 
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                            className="w-6 h-6 bg-white rounded-full shadow-md" 
                        />
                    </div>
                    <span className={`font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>Yearly</span>
                    <span className="bg-teal-400/20 text-teal-300 text-xs font-bold px-2 py-1 rounded-full">SAVE 20%</span>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto"
                >
                    {pricingPlans.map((plan) => (
                        <motion.div 
                            key={plan.name}
                            variants={itemVariants}
                            className={`relative p-8 rounded-2xl border ${
                                plan.isFeatured 
                                ? 'bg-slate-800/70 border-purple-500 shadow-2xl shadow-purple-500/20' 
                                : 'bg-slate-800/50 border-slate-700'
                            }`}
                        >
                            {plan.isFeatured && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <span className="bg-purple-500 text-white text-sm font-semibold px-4 py-1 rounded-full">Most Popular</span>
                                </div>
                            )}
                            <h3 className="text-3xl font-bold text-white">{plan.name}</h3>
                            <p className="mt-4 text-slate-400">{plan.description}</p>
                            <div className="mt-8">
                                <span className="text-5xl font-extrabold text-white">
                                    {typeof plan.price[billingCycle] === 'number' ? `$${plan.price[billingCycle]}` : plan.price[billingCycle]}
                                </span>
                                <span className="text-slate-400 text-lg">
                                    {typeof plan.price[billingCycle] === 'number' ? (billingCycle === 'monthly' ? '/mo' : '/yr') : ''}
                                </span>
                            </div>
                            <ul className="mt-8 space-y-4 text-left">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-teal-400" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup" className={`mt-10 block w-full py-3 px-6 text-center font-semibold rounded-lg transition-all duration-300 group ${
                                plan.isFeatured
                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}>
                                <div className="flex items-center justify-center gap-2">
                                    <span>{plan.cta}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;
