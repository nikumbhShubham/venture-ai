import React from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Users,
  BookOpen,
  Palette,
  Type,
  Target,
  Lightbulb,
  Download,
  Save,
  Copy,
  RefreshCw,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface BrandKit {
  _id: string;
  brandName: string;
  businessIdea: string;
  logoConcept?: string;
  brandStory?: string;
  targetPersona?: any;
  colorPalette?: { [key: string]: string };
  fontPairing?: { [key: string]: string };
  marketPositioning?: string;
  marketingChannels?: string[];
  contentPillars?: string[];
  postIdeas?: string[];
  status: "generating" | "completed";
}

interface DetailsPanelProps {
  brandKit: BrandKit | null;
  onClose: () => void;
  onSave?: (kitId: string) => void;
  onExport?: (kitId: string) => void;
  onGenerateVariation?: (kitId: string) => void;
}

// Color Palette Component
const ColorPaletteDisplay: React.FC<{ palette: { [key: string]: string } }> = ({
  palette,
}) => (
  <div className="grid grid-cols-2 gap-3">
    {Object.entries(palette).map(([name, hex]) => (
      <div key={name} className="text-center">
        <div
          className="w-full h-16 rounded-lg border border-slate-600 cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: hex }}
          onClick={() => navigator.clipboard?.writeText(hex)}
          title={`Click to copy ${hex}`}
        />
        <p className="mt-1 text-xs font-medium text-white capitalize">{name}</p>
        <p className="text-xs text-slate-400 uppercase">{hex}</p>
      </div>
    ))}
  </div>
);

// Font Pairing Component
const FontPairingDisplay: React.FC<{ fonts: { [key: string]: string } }> = ({
  fonts,
}) => (
  <div className="space-y-3">
    <div>
      <p className="text-xs text-slate-400 uppercase mb-1">Heading Font</p>
      <p
        className="text-xl font-bold text-white"
        style={{ fontFamily: `'${fonts.heading}', sans-serif` }}
      >
        {fonts.heading}
      </p>
    </div>
    <div>
      <p className="text-xs text-slate-400 uppercase mb-1">Body Font</p>
      <p
        className="text-sm text-slate-300"
        style={{ fontFamily: `'${fonts.body}', sans-serif` }}
      >
        {fonts.body}
      </p>
    </div>
  </div>
);

// Persona Display Component
const PersonaDisplay: React.FC<{ persona: any }> = ({ persona }) => {
  if (!persona) return null;

  let parsed;
  try {
    parsed = typeof persona === "string" ? JSON.parse(persona) : persona;
  } catch {
    return <p className="text-slate-400 text-sm">{persona}</p>;
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-white">{parsed.name}</h4>
        <p className="text-xs text-slate-400">
          {parsed.age} yrs • {parsed.occupation}
        </p>
      </div>
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium text-purple-300">Lifestyle:</span>
          <p className="text-slate-400 mt-1">{parsed.lifestyle}</p>
        </div>
        <div>
          <span className="font-medium text-purple-300">Needs:</span>
          <p className="text-slate-400 mt-1">{parsed.needs}</p>
        </div>
      </div>
    </div>
  );
};

// Marketing List Component
const MarketingList: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-1">
    {items.map((item, idx) => (
      <span
        key={idx}
        className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs rounded-full"
      >
        {item}
      </span>
    ))}
  </div>
);

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  brandKit,
  onClose,
  onSave,
  onExport,
  onGenerateVariation,
}) => {
  if (!brandKit) return null;

  const logoUrl = brandKit.logoConcept
    ? `data:image/png;base64,${brandKit.logoConcept}`
    : null;
  const hasValidLogo =
    brandKit.status === "completed" &&
    brandKit.logoConcept &&
    !brandKit.logoConcept.includes("generation_failed") &&
    brandKit.logoConcept !== "placeholder.png";

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="bg-slate-800/50 border-l border-slate-700 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-white truncate">
            {brandKit.brandName}
          </h2>
          <p className="text-sm text-slate-400 line-clamp-2 mt-1">
            {brandKit.businessIdea}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-1 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Logo Section */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <ImageIcon size={16} />
            Logo
          </h3>
          <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center p-4 mb-3">
            {hasValidLogo && logoUrl ? (
              <img
                src={logoUrl}
                alt="Generated Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-500">
                <ImageIcon size={32} className="mx-auto mb-2" />
                <p className="text-xs">
                  {brandKit.status === "generating" ? "Generating..." : "Logo Failed"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Color Palette */}
        {brandKit.colorPalette && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Palette size={16} />
              Color Palette
            </h3>
            <ColorPaletteDisplay palette={brandKit.colorPalette} />
          </div>
        )}

        {/* Typography */}
        {brandKit.fontPairing && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Type size={16} />
              Typography
            </h3>
            <FontPairingDisplay fonts={brandKit.fontPairing} />
          </div>
        )}

        {/* Target Persona */}
        {brandKit.targetPersona && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users size={16} />
              Target Persona
            </h3>
            <PersonaDisplay persona={brandKit.targetPersona} />
          </div>
        )}

        {/* Brand Story */}
        {brandKit.brandStory && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen size={16} />
              Brand Story
            </h3>
            <p className="text-sm text-slate-300 italic border-l-2 border-purple-500 pl-3">
              {brandKit.brandStory}
            </p>
          </div>
        )}

        {/* Marketing Strategy */}
        {brandKit.marketPositioning && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Target size={16} />
              Marketing
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-purple-300 mb-1">Positioning</p>
                <p className="text-sm text-slate-300">{brandKit.marketPositioning}</p>
              </div>
              {brandKit.marketingChannels && (
                <div>
                  <p className="text-xs font-medium text-purple-300 mb-2">Channels</p>
                  <MarketingList items={brandKit.marketingChannels} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Ideas */}
        {(brandKit.contentPillars || brandKit.postIdeas) && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb size={16} />
              Content Ideas
            </h3>
            <div className="space-y-3">
              {brandKit.contentPillars && (
                <div>
                  <p className="text-xs font-medium text-purple-300 mb-2">Content Pillars</p>
                  <MarketingList items={brandKit.contentPillars} />
                </div>
              )}
              {brandKit.postIdeas && (
                <div>
                  <p className="text-xs font-medium text-purple-300 mb-2">Post Ideas</p>
                  <MarketingList items={brandKit.postIdeas} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        {hasValidLogo && logoUrl && (
          <a
            href={logoUrl}
            download={`${brandKit.brandName}-logo.png`}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Download size={16} />
            Download Logo
          </a>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          {onSave && (
            <button
              onClick={() => onSave(brandKit._id)}
              className="flex items-center justify-center gap-1 bg-slate-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Save size={14} />
              Save
            </button>
          )}
          {onExport && (
            <button
              onClick={() => onExport(brandKit._id)}
              className="flex items-center justify-center gap-1 bg-slate-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Copy size={14} />
              Export
            </button>
          )}
        </div>
        
        {onGenerateVariation && (
          <button
            onClick={() => onGenerateVariation(brandKit._id)}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <RefreshCw size={16} />
            Generate Variation
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DetailsPanel;