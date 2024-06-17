import React, { useEffect, useContext, useState, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useSocket } from '../../socket/socketConnection';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import MessageField from './MessageComponent';
import { AddMessage ,EditMessage} from '../../actions/taskActions'

const ChatComponent = (props) => {
    const { user, id } = props;
    // const socket = useSocket();
    const chatContentRef = useRef(null);
    const [message, setMessage] = useState('');
    const messages = useSelector(state => state.messageState);
    let dispatch = useDispatch();
    const socket = useSocket();
    const currentUser = localStorage.getItem('userId');
    const [calling,setCalling]=useState(false);
    const [called,setCalled]=useState(false);

    const sendMessage = async (e) => {
        const data = {
            senderId: currentUser,
            receiverId: id,
            message: message,
        }
        const sendMessage = await axios.post('http://localhost:3000/message/saveMessage', data);
        data.id = sendMessage.data.message._id;
        data.updatedAt = sendMessage.data.updatedAt;
        socket.emit('new message', { data: data });
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop += chatContentRef.current.scrollHeight;
        }
        dispatch(AddMessage(data));
        setMessage('');
    }
    const setUserOnlineStatus = (e) => {
        console.log(e);
    }
    const setUserMessage = (e) => {
        setMessage(e.target.value);
    }
    const fetchNewMessage = (e) => {
        if (e.data.senderId !== currentUser) {
            dispatch(AddMessage(e.data));
        }

    }
    const editTheMessage=(e)=>{
        console.log(e);
        dispatch(EditMessage({id:e._id,message:e.message}));
    }
    useEffect(() => {
        if (socket) {
            socket.on('new message', fetchNewMessage);
            socket.on('message updated',editTheMessage);
            return () => {
                socket.off('new message');
                socket.off('message updated',editTheMessage);
            };
        }
        }, [socket,fetchNewMessage,editTheMessage]);
    useEffect(() => {
        if (chatContentRef.current) { //whenever we dispatch a message , store gets modified.On updation of store scroll
            chatContentRef.current.scrollTop *= chatContentRef.current.clientHeight;
            console.log(chatContentRef.current.scrollTop);
        }
    }, [messages]);

    return (
        <div className="chat__content__container" ref={chatContentRef} >
            <div className="chat__header">
                <div className="user__image__container">
                    <div className="circle"></div>
                </div>
                <div className="selected__user">
                    <p>{user}</p>
                </div>
            </div>
            <div className="chat__content">
                {messages?.map((message) => (
                    <MessageField key={message.id} message={message.message} senderId={message.senderId} updatedAt={message.updatedAt} id={message._id} />
                ))}
            </div>
            <div className="chat__footer">
                <div className="input-container">
                    <input type="text" className="form-control" value={message} onChange={setUserMessage} />
                </div>
                <div className="icon__container" onClick={sendMessage}>
                    <FaPaperPlane />
                </div>
            </div>
        </div>
    );
};
export default ChatComponent;