import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import { loginUser,registerUser } from '../services/apiService'

interface AuthState{
    user:any,
    token:string|null,
    isLoading:boolean,
    error:string|null,
    login:(userData:any,navigate:(path:string)=>void)=>Promise<void>,
    register:(userData:any,navigate:(path:string)=>void)=>Promise<void>,
    logout:()=>void;
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
            clearError:()=>set({error:null})
        }),
        {
            name:'auth-storage',
            partialize:(state)=>({token:state.token,user:state.user})
        }
    )
)