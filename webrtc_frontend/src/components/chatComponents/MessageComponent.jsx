import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EditMessage } from '../../actions/taskActions';
import { FiEdit2 } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";


const MessageField = (props) => {
    const { message, senderId, updatedAt ,id } = props;
    const currentUser = localStorage.getItem('userId');
    const messageClass = senderId === currentUser ? 'same-user' : 'selected-user';
    const [timediff, setTimeDiff] = useState(null);
    const messageRef = useRef(null);
    const [editMessageEnabled,setEditMessageEnabled]=useState(null);
    let dispatch = useDispatch();
    const calculateTime =()=>{
        const givenDate = new Date(updatedAt);
        const currentDate = new Date();
        const diff = currentDate - givenDate;
        const diffInMin = Math.floor(diff / (1000 * 60));
        const diffInHour = Math.floor(diffInMin / 60);
        const diffInDays = Math.floor(diffInHour / 24);
        let value = '';
        if (diffInDays > 0) {
            value += `${diffInDays} days ago`
        }
        else if (diffInHour % 24 > 0) {
            value += `${diffInHour%24} hours ago`
        }
        else if (diffInMin % 60 > 0 || value == '') {
            value += `${diffInMin % 360} min ago`
        }
        setTimeDiff(value.trim());
    }
  
    useEffect(() => {
        let interval=null
        if (updatedAt) {        
         interval = setInterval(calculateTime, 6000);  
        } 
        return () => {
            clearInterval(interval);
    }
    }, [timediff,message])

    const editMessage=()=>{
        console.log(messageRef.current);
        setEditMessageEnabled(true);
        if(messageRef.current)
        {
            const input = document.createElement('input');
            input.className='edit_message';
            input.id=messageRef.current.id;
            input.value=messageRef.current.textContent;
            applyStyle(messageRef.current,input,input.value);           
             messageRef.current.replaceWith(input);
            messageRef.current=input;
            messageRef.current.focus();

        }
    }
    const editTheSelectedMessage=()=>{
        setEditMessageEnabled(false);  
        const span = document.createElement('span');
        span.className='user__message';
        span.innerText=messageRef.current.value;
        applyStyle(messageRef.current,span,span.innerText);
        messageRef.current.replaceWith(span);
        messageRef.current=span;
        const payload={
            id:messageRef.current.id,
            message:message
        }
        dispatch(EditMessage(payload));
    }
    const applyStyle=(source,target,value)=>{
        const styles = getComputedStyle(source);
        for(const prop of Array.from(styles))
        {
            target.style.setProperty(prop,styles.getPropertyValue(prop));
        }
        target.value=value;
    }
    return (
        <div className={` message && ${messageClass}`}>
            <p> <span className="user__message" ref={messageRef} key={id} id={id}>{message}</span>{senderId === currentUser && !editMessageEnabled? (<span className="icon" onClick={editMessage}><FiEdit2/></span>):(senderId === currentUser && <span onClick={editTheSelectedMessage} className="icon"><FaCheck/></span>)}</p>
        </div>
    )
}
export default MessageField;