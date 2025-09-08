import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore';

const API_URL='http://localhost:5001/api/';

const api=axios.create({
    baseURL:API_URL,
});

api.interceptors.request.use(
    (config)=>{
        const token=useAuthStore.getState().token;
        if(token){
            config.headers['Authorization']=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)


export const registerUser=(userData: any)=>{
    return api.post('auth/register',userData);
}

export const loginUser=(userData:any)=>{
    return api.post('auth/login',userData);
}



export const getBrandKits=()=> api.get('brandkits');
export const createBrandKit=(data:{businessIdea:string})=> api.post('brandkits',data);
export const getBrandKitById=()=>(id:string)=>api.get(`brandkits/${id}`);