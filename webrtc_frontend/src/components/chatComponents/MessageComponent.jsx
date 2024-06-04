import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EditMessage } from '../../actions/taskActions';
const MessageField = (props) => {
    const { message, senderId, updatedAt ,id } = props;
    const currentUser = localStorage.getItem('userId');
    const messageClass = senderId === currentUser ? 'same-user' : 'selected-user';
    const [timediff, setTimeDiff] = useState(null);
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
        const payload={
            id:id,
            message:message
        }
        dispatch(EditMessage(payload));
    }
    return (
        <div className={` message && ${messageClass}`}>
            <p> <span className="user__message">{message}</span></p>
            {/* <p><span onClick={editMessage}>Edit</span></p> */}
        </div>
    )
}
export default MessageField;