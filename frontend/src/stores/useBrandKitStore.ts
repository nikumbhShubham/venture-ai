import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { getBrandKits,getBrandKitById, createBrandKit, deleteBrandKitId } from "../services/apiService";
import { Socket } from "socket.io-client";


interface BrandKit {
    _id: string;
    brandName: string;
    status: 'pending' | 'completed' | 'failed';
    [key: string]: any;
}

interface BrandKitState {
    brandKits: BrandKit[]; // <-- Corrected typo here
    isLoading: boolean;
    error: string | null;
    fetchBrandKits: () => Promise<void>;
    startGeneration: (businessIdea: string, navigate: (path: string) => void) => Promise<void>;
    initializeSocketListeners:(socket:Socket)=>void;
}

export const useBrandKitStore = create<BrandKitState>((set, get) => ({
    brandKits: [], // <-- Corrected typo here
    isLoading: false,
    error: null,

    fetchBrandKits: async () => {
        set({ isLoading: true, error: null });
        try {
            // const token = useAuthStore.getState().token;
            // if (!token) throw new Error("Not authenticated");
            const { data } = await getBrandKits();
            set({ brandKits: data, isLoading: false });
        } catch (err: any) {
            set({ error: "Failed to fetch brand kits.", isLoading: false });
        }
    },
    startGeneration: async (businessIdea, navigate) => {
    set({ isLoading: true, error: null });
    try {
        const user = useAuthStore.getState().user;
        await createBrandKit({ businessIdea, userId: user._id });
        useAuthStore.getState().decrementCredits(); // decrement after success
        await get().fetchBrandKits();
        navigate('/dashboard');
        set({ isLoading: false });
    } catch (error: any) {
        set({ error: "Failed to start generation.", isLoading: false });
    }
    },
    deleteBrandKit:async(id:string)=>{
        set({isLoading:true,error:null});
        try {
            await deleteBrandKitId(id);
            set((state)=>({
                brandKits:state.brandKits.filter((kit)=>kit._id != id),
                isLoading:false,
            }))
        } catch (error:any) {
            set({error:"Failed to delete brand kit",isLoading:false});
        }
    },
    setBrandKits: (kits) => set({ brandKits: kits }),


   // initializeSocketListeners 
    initializeSocketListeners:(socket) => {
        // Listen for the 'brandKitCompleted' event from the server
        socket.on('brandKitCompleted', (completedKit: BrandKit) => {
            console.log('[Socket] Received completed kit:', completedKit);
            set(state => ({
                // Update the specific kit in the array with the new data
                brandKits: state.brandKits.map(kit => 
                    kit._id === completedKit._id ? completedKit : kit
                )
            }));
        });

        // Listen for the 'brandKitFailed' event
        socket.on('brandKitFailed', ({ brandKitId }: { brandKitId: string }) => {
             console.log('[Socket] Received failed kit:', brandKitId);
             set(state => ({
                brandKits: state.brandKits.map(kit => 
                    kit._id === brandKitId ? { ...kit, status: 'failed' } : kit
                )
            }));
        });
    }

    
    
}));

