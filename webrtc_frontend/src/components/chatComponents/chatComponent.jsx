import React, { useEffect,useContext,useState} from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import {useSocket} from '../../socket/socketConnection';
const ChatComponent = (props) => {
    const { user ,id} = props;
    // const socket = useSocket();
    const [message,setMessage]=useState('');
    const socket = useSocket();

    const sendMessage=(e)=>{
        const senderId = localStorage.getItem('userId');
        const data={
            senderId:senderId,
            recieverId:id,
            message:message
        }
        socket.emit('new message',{data:data});
        setMessage('');
       
    }
    const setUserOnlineStatus=(e)=>{
        console.log(e);
    }
    const setUserMessage=(e)=>{
        console.log(e);
        setMessage(e.target.value);
    }
    const fetchNewMessage =(e)=>{
        console.log(e);
    }
    useEffect(()=>{
      socket.on('new message',fetchNewMessage);
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
                   <input type="text" className="form-control" value={message} onChange={setUserMessage} />
                </div>
                <div className="icon__container" onClick={sendMessage}>
                 <FaPaperPlane/>
                </div>
            </div> 
        </div>
    );
};
export default ChatComponent;