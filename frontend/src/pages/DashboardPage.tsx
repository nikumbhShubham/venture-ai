import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../stores/useAuthStore.ts";
import { useBrandKitStore } from "../stores/useBrandKitStore.ts";
import {
  PlusCircle,
  Loader,
  LogOut,
  Image as ImageIcon,
  Wind,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { deleteBrandKitId } from "../services/apiService.ts";

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
    const timer = setTimeout(onDismiss, 5000); // Auto-dismiss after 5 seconds
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

const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className=" bg-slate-700 text-white rounded-lg shadow-lg p-6 w-96"
      >
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user, logout, fetchUserProfile } = useAuthStore();
  const { brandKits, isLoading, fetchBrandKits } = useBrandKitStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<null | string>(null);

  useEffect(() => {
    fetchBrandKits();

    // --- Check for Stripe redirect parameters ---
    if (searchParams.get("payment_success")) {
      setToast({
        message: "Subscription successful! Welcome to Pro.",
        type: "success",
      });
      // --- FIX 1: Refetch user profile to update credits ---
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

  const {setBrandKits}=useBrandKitStore();

  const handleDelete = async (id: string) => {
    try {
      await deleteBrandKitId(id);
      setBrandKits(brandKits.filter((kit)=>kit._id!==id));
      setToast({ message: "BrandKit deleted successfully!", type: "success" });
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to delete BrandKit.",
        type: "error",
      });
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-slate-200 font-sans">
      <header className="bg-slate-900/50 backdrop-blur-md p-4 border-b border-slate-700 flex justify-between items-center sticky top-0 z-10">
        <Link to="/" className="text-2xl font-bold text-white tracking-wider">
          Venture <span className="text-purple-400">AI</span>
        </Link>
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
      <main className="p-8 container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Welcome, {user?.name}!
            </h2>
            <p className="text-slate-400 mt-2">
              Here are your generated brand kits.
            </p>
          </div>
          <Link
            to="/generate"
            className="flex items-center gap-2 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
          >
            <PlusCircle size={20} /> Create New Kit
          </Link>
        </div>
        {isLoading && brandKits.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 animate-spin text-purple-400" />
          </div>
        ) : !isLoading && brandKits.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-700">
            <Wind size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-2xl font-bold text-white">Nothing here yet!</h3>
            <p className="text-slate-400 mt-2">
              Click "Create New Kit" to generate your first brand identity.
            </p>
          </div>
        ) : (
          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {brandKits.map((kit) => {
              const logoUrl = `data:image/png;base64,${kit.logoConcept}`;
              // --- FIX 2: More robust check for a valid logo ---
              const hasValidLogo =
                kit.status === "completed" &&
                kit.logoConcept &&
                !kit.logoConcept.includes("generation_failed") &&
                kit.logoConcept !== "placeholder.png";
              return (
                <div key={kit._id} className="relative group">
                  <Link to={`/results/${kit._id}`} key={kit._id}>
                    <motion.div
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      className="bg-slate-800/50 backdrop-blur-md rounded-xl shadow-lg border border-slate-700 overflow-hidden h-full hover:border-purple-400/50 transition-all group"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div className="w-full h-40 bg-slate-700 rounded-md mb-4 flex flex-col items-center justify-center relative overflow-hidden p-4">
                          {kit.status === "completed" ? (
                            hasValidLogo ? (
                              <img
                                src={logoUrl}
                                alt={`${kit.brandName} Logo`}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-center text-slate-500">
                                <ImageIcon size={40} className="mx-auto mb-2" />
                                <p>Logo Failed</p>
                              </div>
                            )
                          ) : (
                            <div className="flex flex-col items-center text-center">
                              <Loader className="animate-spin text-purple-400 mb-2" />
                              <span className="text-slate-300 font-semibold">
                                Generating...
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white truncate">
                          {kit.brandName}
                        </h3>
                        <p className="text-sm text-slate-400 truncate flex-grow">
                          {kit.businessIdea}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(kit._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </main>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this brand kit?"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
