import React ,{ createContext , useMemo , useContext} from 'react';
import { io } from 'socket.io-client';
export const socket = io('http://localhost:3000',{ transports: ['websocket', 'polling', 'flashsocket'] });
const SocketContext = createContext(socket);
export default SocketContext;

export const useSocket=()=>{
    const socket = useContext(SocketContext);
    return socket;
}
// The useContext hook is a React hook that lets you read and subscribe to context from your component
// Context is a way to pass data through the component tree without having to pass props down manually at every level


