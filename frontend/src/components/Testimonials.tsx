import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

// Mock data for testimonials
const testimonials = [
    {
        quote: "Venture AI is an absolute game-changer. It took our rough idea and gave us a full brand identity in minutes. The logo concepts were beyond what we could have imagined.",
        name: "Anya Sharma",
        title: "Founder, AuraBrew Coffee",
        avatar: "https://i.pravatar.cc/150?img=1", // Placeholder image
    },
    {
        quote: "As a freelancer, speed is everything. This tool saved me days of work. The generated personas are incredibly detailed and genuinely useful for marketing.",
        name: "Rohan Verma",
        title: "UX Designer & Consultant",
        avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
        quote: "We were stuck on naming for weeks. The Namer Agent gave us 'Zenith Fitness' and it just clicked. The whole package feels cohesive and professional. Highly recommended!",
        name: "Priya Singh",
        title: "Co-founder, Zenith Fitness",
        avatar: "https://i.pravatar.cc/150?img=5",
    },
];

const Testimonials = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div id="testimonials" className="relative w-full text-white font-sans py-24 sm:py-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
                {/* Background Glows */}
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-slate-300 to-teal-300 bg-clip-text text-transparent"
                >
                    Loved by Innovators Worldwide
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 max-w-2xl mx-auto text-lg text-slate-400"
                >
                    Hear what our early adopters are saying about their experience with Venture AI.
                </motion.p>

                {/* Testimonial Cards */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20 max-w-7xl mx-auto"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col p-8 rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-lg shadow-lg text-left"
                        >
                            <Quote className="w-10 h-10 text-purple-400 mb-6" />
                            <p className="text-slate-300 text-lg leading-relaxed flex-grow">"{testimonial.quote}"</p>
                            <div className="mt-8 flex items-center gap-4">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full border-2 border-purple-400/50" />
                                <div>
                                    <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                                    <p className="text-slate-400">{testimonial.title}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Testimonials;
