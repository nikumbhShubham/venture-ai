import React from "react";
import { motion } from "framer-motion";
import { Loader, Image as ImageIcon, Trash2 } from "lucide-react";

interface BrandKit {
  _id: string;
  brandName: string;
  businessIdea: string;
  logoConcept?: string;
  status: "generating" | "completed";
}

interface HistoryListProps {
  brandKits: BrandKit[];
  isLoading: boolean;
  selectedKitId: string | null;
  onSelectKit: (kit: BrandKit) => void;
  onDeleteKit: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  brandKits,
  isLoading,
  selectedKitId,
  onSelectKit,
  onDeleteKit,
}) => {
  return (
    <div className="bg-slate-800/50 border-r border-slate-700 h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Brand Kits</h2>
        <p className="text-sm text-slate-400">Your generated brand identities</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading && brandKits.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <Loader className="w-6 h-6 animate-spin text-purple-400" />
          </div>
        ) : brandKits.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <p>No brand kits yet.</p>
            <p className="text-sm mt-1">Start a conversation to create one!</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {brandKits.map((kit) => {
              const isSelected = selectedKitId === kit._id;
              const hasValidLogo =
                kit.status === "completed" &&
                kit.logoConcept &&
                !kit.logoConcept.includes("generation_failed") &&
                kit.logoConcept !== "placeholder.png";

              return (
                <motion.div
                  key={kit._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`relative group cursor-pointer p-3 rounded-lg transition-all hover:bg-slate-700/50 ${
                    isSelected ? "bg-purple-600/20 border border-purple-500/40" : ""
                  }`}
                  onClick={() => onSelectKit(kit)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-md flex items-center justify-center flex-shrink-0">
                      {kit.status === "completed" ? (
                        hasValidLogo ? (
                          <img
                            src={`data:image/png;base64,${kit.logoConcept}`}
                            alt={`${kit.brandName} Logo`}
                            className="w-full h-full object-contain rounded-md"
                          />
                        ) : (
                          <ImageIcon size={16} className="text-slate-500" />
                        )
                      ) : (
                        <Loader className="w-4 h-4 animate-spin text-purple-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm truncate">
                        {kit.brandName}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {kit.businessIdea}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteKit(kit._id);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;