import React ,{ createContext , useMemo , useContext ,useState,useEffect} from 'react';
import { io } from 'socket.io-client';
// const Socket = io('http://localhost:3000',{ transports: ['websocket', 'polling', 'flashsocket'] });

const SocketContext = createContext();

export const useSocket=()=>{
    const socket = useContext(SocketContext);
    return socket;
}
export const SocketProvider = ({token,children})=>{
    const [socket,setSocket] = useState(null);

    useEffect(()=>{
        if(token)
        {
        const newSocket = io('http://localhost:3000',{ transports: ['websocket', 'polling', 'flashsocket'] , auth:{token:token} });
         setSocket(newSocket);
         return ()=>{
             newSocket.close();
             console.log('Socket closed');
         }
        }
    },[token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
// The useContext hook is a React hook that lets you read and subscribe to context from your component
// Context is a way to pass data through the component tree without having to pass props down manually at every level


