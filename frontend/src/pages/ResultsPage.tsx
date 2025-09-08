import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBrandKitStore } from '../stores/useBrandKitStore.ts';
import { ArrowLeft, Loader, Image as ImageIcon, Users, BookOpen, Quote, Download, Palette, Type, Target, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Reusable Component for each section of the brand kit ---
const BrandSection = ({ icon: Icon, title, children, delay = 0 }: { icon: any; title: string; children: React.ReactNode; delay?: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-lg"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                <Icon className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-purple-300 prose-ul:list-disc prose-li:marker:text-purple-400">
            {children}
        </div>
    </motion.div>
);

// --- Specialized components for unique data types ---
const ColorPaletteDisplay = ({ palette }: { palette: { [key: string]: string } }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {Object.entries(palette).map(([name, hex]) => (
            <div key={name} className="text-center">
                <div className="w-full h-20 rounded-lg border-2 border-slate-700" style={{ backgroundColor: hex }}></div>
                <p className="mt-2 font-semibold text-white capitalize">{name}</p>
                <p className="text-sm text-slate-400 uppercase">{hex}</p>
            </div>
        ))}
    </div>
);

const FontPairingDisplay = ({ fonts }: { fonts: { [key: string]: string } }) => (
     <div className="space-y-4 mt-2">
        <div>
            <p className="text-sm text-slate-400 uppercase">Heading Font</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: `'${fonts.heading}', sans-serif` }}>{fonts.heading}</p>
        </div>
        <div>
            <p className="text-sm text-slate-400 uppercase">Body Font</p>
            <p className="text-lg text-slate-300" style={{ fontFamily: `'${fonts.body}', sans-serif` }}>{fonts.body}</p>
        </div>
    </div>
);

const MarketingList = ({ items }: { items: string[] }) => (
    <ul className="space-y-2 mt-2">
        {items.map((item, index) => (
            <li key={index} className="flex items-start">
                <ArrowRight className="w-4 h-4 text-purple-400 mt-1.5 mr-3 flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);


const ResultsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { brandKits, fetchBrandKits, isLoading } = useBrandKitStore();
    const kit = brandKits.find(k => k._id === id);

    useEffect(() => {
        if (brandKits.length === 0) {
            fetchBrandKits();
        }
    }, [id, brandKits.length, fetchBrandKits]);

    if (isLoading || !kit) {
        return <div className="min-h-screen bg-[#0a0f1f] flex items-center justify-center"><Loader className="w-16 h-16 animate-spin text-purple-400" /></div>;
    }

    const logoUrl = `data:image/png;base64,${kit.logoConcept}`;

    return (
        <div className="min-h-screen bg-[#0a0f1f] text-slate-200 font-sans">
             <header className="bg-slate-900/50 backdrop-blur-md p-4 border-b border-slate-700 sticky top-0 z-20">
                <div className="container mx-auto">
                    <Link to="/dashboard" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                </div>
            </header>
            <main className="p-8 container mx-auto">
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        
                        <motion.div variants={{hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 }}} className="lg:col-span-1 space-y-8 lg:sticky top-24 h-fit">
                            <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
                                <h2 className="text-4xl font-extrabold text-white">{kit.brandName}</h2>
                                <p className="text-slate-400 mt-2">{kit.businessIdea}</p>
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg">
                                <h3 className="text-xl font-semibold text-white mb-4">Generated Logo</h3>
                                <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center p-4">
                                    {kit.logoConcept && !kit.logoConcept.includes('failed') ? (
                                        <img src={logoUrl} alt="AI Generated Logo" className="w-full h-full object-contain"/>
                                    ) : (
                                        <div className="text-center text-slate-500">
                                            <ImageIcon size={48} className="mx-auto mb-2"/>
                                            <p>Logo Generation Failed</p>
                                        </div>
                                    )}
                                </div>
                                 <a 
                                    href={logoUrl} 
                                    download={`${kit.brandName}-logo.png`}
                                    className={`mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors ${kit.logoConcept && !kit.logoConcept.includes('failed') ? 'hover:bg-purple-700' : 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <Download size={16} /> Download Logo
                                </a>
                            </div>
                        </motion.div>

                        <div className="lg:col-span-2 space-y-8">
                           <BrandSection icon={Users} title="Ideal Customer Persona" delay={0.1}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{kit.targetPersona}</ReactMarkdown>
                           </BrandSection>
                           <BrandSection icon={BookOpen} title="Brand Story" delay={0.2}>
                                <p>{kit.brandStory}</p>
                           </BrandSection>
                           <BrandSection icon={Palette} title="Visual Identity" delay={0.3}>
                                {kit.colorPalette && <ColorPaletteDisplay palette={kit.colorPalette} />}
                                {kit.fontPairing && <div className="mt-6 pt-6 border-t border-slate-700"><FontPairingDisplay fonts={kit.fontPairing} /></div>}
                           </BrandSection>
                           <BrandSection icon={Target} title="Marketing Strategy" delay={0.4}>
                                <h4 className="font-semibold text-white mb-2">Market Positioning</h4>
                                <p className="mb-6">{kit.marketPositioning}</p>
                                <h4 className="font-semibold text-white mb-2">Top Marketing Channels</h4>
                                {kit.marketingChannels && <MarketingList items={kit.marketingChannels} />}
                           </BrandSection>
                           <BrandSection icon={Lightbulb} title="Content Ideas" delay={0.5}>
                                <h4 className="font-semibold text-white mb-2">Content Pillars</h4>
                                {kit.contentPillars && <MarketingList items={kit.contentPillars} />}
                                <h4 className="font-semibold text-white mt-6 mb-2">Post Ideas</h4>
                                {kit.postIdeas && <MarketingList items={kit.postIdeas} />}
                           </BrandSection>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ResultsPage;

