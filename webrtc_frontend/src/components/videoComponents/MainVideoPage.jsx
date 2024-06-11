import React from 'react';
import FormInput from '../FormInput';
import { useContext, useEffect, useState, useCallback} from 'react';
import { useDispatch, useSelector } from "react-redux";
import {useSocket} from '../../socket/socketConnection';
import VideoRoom from './VideoRoom';
import UserDisplay from '../chatComponents/UserDisplay';
import peer from '../webrtcService';


const MainVideoPage = () => {
    const [ joinRoom,setJoinRoom]=useState(null);
    const users = useSelector(state=>state.users);
    const [stream,setStreams] = useState(null);
    const socket = useSocket();
    const [remoteSocket,setRemoteSocket] = useState(null);

    const handleJoin = (e) => {
        const currentUser = localStorage.getItem('userId');
        console.log(e);
        setJoinRoom(e.email);
        socket.emit('room join',{email:e.email,roomId:e._id+"_"+currentUser,selectedUser:e._id});
        showUserMedia();
    };
    const handleUserJoin=useCallback((e)=>{
      setJoinRoom(e);
      setRemoteSocket(e.id);
    });
    const changeRoomStatus=()=>{
        setJoinRoom(null);
    }
    const showUserMedia =async ()=>{
        const stream =await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        const offer = await peer.getOffer();
        socket.emit('user call',{to:remoteSocket,offer});//create an offer and send
        setStreams(stream);
    }
    useEffect(()=>{
      if(socket)
      {
      socket.on('user joined',handleUserJoin);
      
      return ()=>{
          socket.off('user joined',handleUserJoin);
      }
    }
    },[socket,handleUserJoin])
    return (
       <div className="video__container">
           { joinRoom ?
             (<VideoRoom changeJoinRoom={changeRoomStatus} stream={stream} remoteSocketID={remoteSocket}/>):(
               <div className="video__component">
               <div className="join__room__form">
                   <div className="join__room__form__container">
                       {
                           users?.users?.map((user)=>(
                               <div className="video__page--user__container" onClick={()=>handleJoin({email:user.email,_id:user._id})}>
                                   <div className="user__avatar">

                                   </div>
                                   <div className="user__name">{user.username}</div>
                               </div>
                           ))
                       }
   
                   </div>
               </div>
               <div className="button__container" style={{ margin: '10px' }}>
                   <h4>Click on the user to video call</h4>
               </div>
           </div>
           )}
       </div>
    );
}
export default MainVideoPage;
