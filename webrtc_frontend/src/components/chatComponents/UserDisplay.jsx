import React, { useEffect,useContext } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import {useSocket} from '../../socket/socketConnection';
const UserDisplay = (props)=>{
    let {_id , username ,setUsers} = props;
    username = username.split(" ").reduce((acc,curr)=>acc+(curr.charAt(0).toUpperCase()+curr.slice(1)));
    const sendSelectedUser=(e)=>{
      setUsers(_id,username);
    }
    const socket = useSocket();
    const getOnlineUser = (e)=>{
      console.log(e);
    }
    useEffect(()=>{
      console.log(socket)
      socket.on('user__online',getOnlineUser);
      return()=>{
          socket.off('user__online')
      };
    },[socket]);
    return(
   <div className="user__container" key={_id}  onClick={sendSelectedUser}>
       <div className="user__image__container">
         <div className="circle"></div>
         <div className="status__indicator" ></div>
       </div>
       <div className="user__name__container">
         <p>{username}</p>
       </div>
   </div>
    
    );
}
export default UserDisplay;