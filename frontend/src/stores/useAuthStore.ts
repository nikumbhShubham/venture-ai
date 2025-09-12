import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import { loginUser,registerUser, getUserProfile } from '../services/apiService'

interface AuthState{
    user:any,
    token:string|null,
    isLoading:boolean,
    error:string|null,
    login:(userData:any,navigate:(path:string)=>void)=>Promise<void>,
    register:(userData:any,navigate:(path:string)=>void)=>Promise<void>,
    logout:()=>void;
    fetchUserProfile: () => Promise<void>;
    clearError:()=>void;
}

export const useAuthStore=create<AuthState>()(
    persist(
        (set)=>({
            user:null,
            token:null,
            isLoading:false,
            error:null,
            login:async (userData, navigate)=> {
                set({isLoading:true,error:null});
                try {
                    const {data}=await loginUser(userData);
                    set({user:data,token:data.token,isLoading:false});
                    navigate('/dashboard')
                } catch (error:any) {
                    set({error:error.response?.data?.message || 'Login Failed',isLoading:false})
                }

            },
            register:async(userData,navigate)=>{
                set({isLoading:true,error:null});
                try {
                    const {data}=await registerUser(userData);
                    set({user:data,token:data.token,isLoading:false});
                    navigate('/dashboard')
                } catch (error:any) {
                    set({error:error.response?.data?.message || 'Registration Failed',isLoading:false})
                    
                }
            },
            logout:()=> {
                set({user:null,token:null});
                window.location.href="/login"
            },
            fetchUserProfile: async () => {
                try {
                    const { data } = await getUserProfile();
                    set(state => ({ user: { ...state.user, ...data } })); // Merge new data
                } catch (error) {
                    console.error("Failed to refetch user profile", error);
                }
            },
            
            decrementCredits: () => {
                set(state => {
                    if (state.user && state.user.credits > 0) {
                        return { user: { ...state.user, credits: state.user.credits - 1 } };
                    }
                    return {};
                });
            },
            clearError:()=>set({error:null})
        }),
        {
            name:'auth-storage',
            partialize:(state)=>({token:state.token,user:state.user})
        }
    )
)