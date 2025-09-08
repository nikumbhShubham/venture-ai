import React, { createContext, useContext, useEffect,useState } from "react";
import io,{Socket} from 'socket.io-client';
import { useAuthStore } from "../stores/useAuthStore";

interface SocketContextType{
    socket: Socket |null;
}

const SocketContext=createContext<SocketContextType|undefined>(undefined);

export const useSocket=()=>{
    const context=useContext(SocketContext);
    if(context=== undefined){
        throw new Error('useSocket must be used within a SocketProvider');

    }
    return context;
}

export const SocketProvider = ({ children }: { children: React.ReactNode })=>{
    const [socket, setSocket] = useState<Socket|null>(null)
    const {user}=useAuthStore();

    useEffect(()=>{
        if(user?._id){
            const newSocket=io('http://localhost:5001');
            setSocket(newSocket);
            newSocket.on('connect',()=>{
                console.log('Connected to WebSocket server!!');
                newSocket.emit('joinRoom',user._id)
            });

            return()=>{
                newSocket.disconnect();
            };

        }
    },[user])

    return(
        <SocketContext.Provider value={{socket}}>
        {children}
        </SocketContext.Provider>
    )
}