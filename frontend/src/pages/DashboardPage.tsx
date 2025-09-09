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
} from "lucide-react";

// A simple, self-contained Toast component
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

const DashboardPage: React.FC = () => {
    const { user, logout, fetchUserProfile } = useAuthStore();
  const { brandKits, isLoading, fetchBrandKits } = useBrandKitStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Sync local user whenever store changes
 

  useEffect(() => {
    const handlePaymentParams = async () => {
      await fetchBrandKits(); // first load kits

      if (searchParams.get("payment_success")) {
        setToast({
          message: "Subscription successful! Welcome to Pro.",
          type: "success",
        });
        await fetchUserProfile(); // fetch latest credits
        // setUser(updatedUser); // trigger re-render with new credits
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
    };

    handlePaymentParams();
  }, [fetchBrandKits, fetchUserProfile, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-slate-200 font-sans">
      <header className="bg-slate-900/50 backdrop-blur-md p-4 border-b border-slate-700 flex justify-between items-center sticky top-0 z-10">
        <Link to="/" className="text-2xl font-bold text-white tracking-wider">
          Venture <span className="text-purple-400">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            {/* Credits:{" "} */} Credits :{" "}
            <span className="font-bold text-purple-400">
              {user?.credits ?? 0}
              {/* {user.credits} */}
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
                !kit.logoConcept.includes("generation_failed");

              return (
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
    </div>
  );
};

export default DashboardPage;
