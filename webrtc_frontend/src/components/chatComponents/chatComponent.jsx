import React, { useEffect,useContext,useState} from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import {useSocket} from '../../socket/socketConnection';
import axios from 'axios';
import { useSelector , useDispatch } from 'react-redux';
import MessageField from './MessageComponent';
import {AddMessage} from '../../actions/taskActions'

const ChatComponent = (props) => {
    const { user ,id} = props;
    // const socket = useSocket();
    const [message,setMessage]=useState('');
    const messages = useSelector(state => state.messageState);
    let dispatch = useDispatch();
    const socket = useSocket();
    const currentUser = localStorage.getItem('userId');
    const sendMessage=async (e)=>{
        const data={
            senderId:currentUser,
            receiverId:id,
            message:message
        }
        const sendMessage = await axios.post('http://localhost:3000/message/saveMessage',data);
        data.id = sendMessage.data.message._id;
        socket.emit('new message',{data:data});
        dispatch(AddMessage(data));
        setMessage('');
       
    }
    const setUserOnlineStatus=(e)=>{
        console.log(e);
    }
    const setUserMessage=(e)=>{
        setMessage(e.target.value);
    }
    const fetchNewMessage =(e)=>{
        console.log(e);
        if(e.data.senderId !== currentUser)
        {
        dispatch(AddMessage(e.data));
        }
    }
    useEffect(()=>{
      socket.on('new message',fetchNewMessage);
      return ()=>{
          socket.off('new message')
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
             {messages?.map((message)=>(
                <MessageField key={message.id} message={message.message} senderId={message.senderId}/>
             ))}
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