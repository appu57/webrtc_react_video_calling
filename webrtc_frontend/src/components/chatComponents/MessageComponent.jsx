import React from 'react';
const MessageField = (props)=>{
    const {message , senderId}=props;
    const currentUser = localStorage.getItem('userId');
    const messageClass = senderId === currentUser?'same-user':'selected-user'
    return (
        <div className={` message && ${messageClass}`}>
          <span>{message}</span>
        </div>
    )
}
export default MessageField;