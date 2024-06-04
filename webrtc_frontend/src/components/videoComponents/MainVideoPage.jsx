import React from 'react';
import FormInput from '../FormInput';
import { useContext, useEffect, useState, useCallback } from 'react';
import {useSocket} from '../../socket/socketConnection';
import VideoRoom from './VideoRoom';

const MainVideoPage = () => {
    const [ joinRoom,setJoinRoom]=useState(null);
    const socket = useSocket();
    const inputsData = [
        {
            id: 1,
            name: "email",
            placeholder: "Email",
            type: "email"
        },
        {
            id: 2,
            name: "roomId",
            placeholder: "RoomId",
            type: "text"
        }
    ]
    const [formValue, setFormValue] = useState(
        {
            email: '',
            roomId: ''
        }
    );
    const onFormValueChanges = (e) => {
        console.log(e.target)
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleJoin = (e) => {
        e.stopPropagation();
        setJoinRoom(formValue.email);
        socket.emit('room join',formValue);
    }
    const handleUserJoin=useCallback((e)=>{
        const {email,roomId}=e;
        console.log(e);
    });
    const changeRoomStatus=()=>{
        setJoinRoom(null);
    }
    // useEffect(()=>{
    //   socket.on('room join',handleUserJoin);
    //   return ()=>{
    //       socket.off('room join',handleUserJoin);
    //   }
    // },[socket])
    return (
       <div className="video__container">
           { joinRoom ?
             (<VideoRoom changeJoinRoom={changeRoomStatus}/>):(
               <div className="video__component" style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '545px' }}>
               <div className="join__room__form">
                   <div className="join__room__form__container">
                       {
                           inputsData.map((input) => (
                                <input key={input.id} onChange={onFormValueChanges}  {...input} />
                           ))
                       }
   
                   </div>
                   <button className="registerbtn" onClick={handleJoin} >Join</button>
               </div>
               <div className="button__container" style={{ margin: '10px' }}>
                   <button className="btn button__container--joinRoom">Join a Meeting</button>
                   <button className="btn button__container--startCall">Call</button>
               </div>
           </div>
           )}
       </div>
    );
}
export default MainVideoPage;
