import React, { useEffect,useContext } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import {SocketContext} from '../../socket/socketConnection';
const ChatComponent = (props) => {
    const { user } = props;
    // const socket = useSocket();
    const [socket ,setSocket] = useContext(SocketContext);

    console.log(socket)
    const sendMessage=()=>{
        console.log(socket);
       
    }
    const setUserOnlineStatus=(e)=>{
        console.log(e);
    }
    useEffect(()=>{
      console.log(socket);
      socket.on('user__online',setUserOnlineStatus);
      return()=>{
          socket.off('user__online')
      };
    },[socket]);
    return (
        <div className="chat__content__container">
            <div className="chat__header">
                <div className="user__image__container">
                    <div className="circle"></div>
                </div>
                <div className="selected__user">
                    <p>{user}</p>
                </div>
            </div>
            <div className="chat__content">

            </div>
            <div className="chat__footer">
                <div className="input-container">
                   <input type="text" className="form-control" />
                </div>
                <div className="icon__container" onClick={sendMessage}>
                 <FaPaperPlane/>
                </div>
            </div> 
        </div>
    );
};
export default ChatComponent;