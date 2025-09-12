import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, CheckCircle, XCircle } from "lucide-react";
import HistoryList from "../components/HistoryList";
import ChatPanel from "../components/ChatPanel";
import DetailsPanel from "../components/DetailsPanel";
import ConfirmModal from "../components/ConfirmModal";

// TODO: Replace these with your actual store imports
import { useAuthStore } from "../stores/useAuthStore";
import { useBrandKitStore } from "../stores/useBrandKitStore";
import { deleteBrandKitId } from "../services/apiService";

// Mock implementations for development - replace with actual imports
const useAuthStore = () => ({
  user: { name: "John Doe", credits: 10 },
  logout: () => console.log("logout"),
  fetchUserProfile: () => console.log("fetchUserProfile"),
});

const useBrandKitStore = () => ({
  brandKits: [
    {
      _id: "1",
      brandName: "Sample Brand",
      businessIdea: "A sample business idea for testing",
      status: "completed" as const,
      logoConcept: "sample-logo-base64",
      brandStory: "A compelling brand story...",
      colorPalette: { primary: "#6366f1", secondary: "#8b5cf6" },
      fontPairing: { heading: "Inter", body: "Roboto" },
    },
  ],
  isLoading: false,
  fetchBrandKits: () => console.log("fetchBrandKits"),
  setBrandKits: (kits: any[]) => console.log("setBrandKits", kits),
  startGeneration: (idea: string, navigate: any) => {
    console.log("startGeneration", idea);
    // Your actual implementation here
  },
});

const deleteBrandKitId = async (id: string) => {
  console.log("deleteBrandKitId", id);
  // Your actual API call here
};

// Toast Component
const Toast = ({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed bottom-5 right-5 flex items-center gap-4 p-4 rounded-lg shadow-2xl text-white z-50 ${
        type === "success"
          ? "bg-green-600 border border-green-500"
          : "bg-red-600 border border-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle /> : <XCircle />}
      <p className="font-medium">{message}</p>
      <button
        onClick={onDismiss}
        className="ml-4 text-xl font-bold opacity-70 hover:opacity-100"
      >
        &times;
      </button>
    </motion.div>
  );
};

const BrandingWorkspace: React.FC = () => {
  const { user, logout, fetchUserProfile } = useAuthStore();
  const { brandKits, isLoading, fetchBrandKits, setBrandKits, startGeneration } = useBrandKitStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [selectedBrandKit, setSelectedBrandKit] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchBrandKits();

    // Handle Stripe redirect parameters
    if (searchParams.get("payment_success")) {
      setToast({
        message: "Subscription successful! Welcome to Pro.",
        type: "success",
      });
      fetchUserProfile();
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("payment_success");
      setSearchParams(newParams);
    }
    if (searchParams.get("payment_canceled")) {
      setToast({
        message: "Payment was canceled. Your plan was not changed.",
        type: "error",
      });
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("payment_canceled");
      setSearchParams(newParams);
    }
  }, [fetchBrandKits, searchParams, setSearchParams, fetchUserProfile]);

  const handleSelectKit = (kit: any) => {
    setSelectedBrandKit(kit);
  };

  const handleDeleteKit = async (id: string) => {
    try {
      await deleteBrandKitId(id);
      setBrandKits(brandKits.filter((kit) => kit._id !== id));
      setToast({ message: "BrandKit deleted successfully!", type: "success" });
      if (selectedBrandKit?._id === id) {
        setSelectedBrandKit(null);
      }
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to delete BrandKit.",
        type: "error",
      });
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleChatSubmit = (businessIdea: string) => {
    startGeneration(businessIdea, navigate);
  };

  const handleSave = (kitId: string) => {
    setToast({ message: "Brand kit saved!", type: "success" });
  };

  const handleExport = (kitId: string) => {
    setToast({ message: "Brand kit exported!", type: "success" });
  };

  const handleGenerateVariation = (kitId: string) => {
    setToast({ message: "Generating variation...", type: "success" });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md p-4 border-b border-slate-700 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-white tracking-wider">
          Venture <span className="text-purple-400">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            Credits:{" "}
            <span className="font-bold text-purple-400">
              {user?.credits ?? 0}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - History List */}
        <div className="w-80 hidden lg:block">
          <HistoryList
            brandKits={brandKits}
            isLoading={isLoading}
            selectedKitId={selectedBrandKit?._id || null}
            onSelectKit={handleSelectKit}
            onDeleteKit={(id) => setConfirmDelete(id)}
          />
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col">
          <ChatPanel
            isLoading={isLoading}
            onSubmit={handleChatSubmit}
          />
        </div>

        {/* Right Panel - Details */}
        <AnimatePresence>
          {selectedBrandKit && (
            <div className="w-96 hidden lg:block">
              <DetailsPanel
                brandKit={selectedBrandKit}
                onClose={() => setSelectedBrandKit(null)}
                onSave={handleSave}
                onExport={handleExport}
                onGenerateVariation={handleGenerateVariation}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Layout Adjustments */}
      <div className="lg:hidden">
        {/* Mobile history list toggle can be added here */}
        {selectedBrandKit && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedBrandKit(null)}>
            <div className="absolute right-0 top-0 h-full w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <DetailsPanel
                brandKit={selectedBrandKit}
                onClose={() => setSelectedBrandKit(null)}
                onSave={handleSave}
                onExport={handleExport}
                onGenerateVariation={handleGenerateVariation}
              />
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this brand kit?"
          onConfirm={() => handleDeleteKit(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default BrandingWorkspace;