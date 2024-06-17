import React from 'react';
import { useSocket } from '../../socket/socketConnection';
import { useContext, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import peer from '../webrtcService';
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { FaVideoSlash } from "react-icons/fa";
import { PiPhoneDisconnectThin } from "react-icons/pi";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import CameraDisabled from '../../assets/camera_disabled.jpg';
import ShowCallScreen from '../chatComponents/showCall';
import { FaVideo } from "react-icons/fa";
import {UserContext} from '../../socket/loginContext';

import { FaMicrophoneAlt } from "react-icons/fa";
const VideoRoom = () => {
    const socket = useSocket();
    const [remoteSocket, setRemoteSocket] = useState(null);
    const [streams, setStreams] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [joinRoom, setJoinRoom] = useState(null);
    const [videoEnabled, setVideoState] = useState(true);
    const [audioEnabled, setAudioState] = useState(true);
    const [calling, setCalling] = useState(false);
    const [selectedUser,setSelectedUser]=useState(null);
    const [remoteUser , setRemoteUser]=useState(null);
    let [user,setUser] = useContext(UserContext);

    
    const currentUser = localStorage.getItem('userId');
    const users = useSelector(state => state.users);

    const handleJoin = (e) => {
        if (!peer.peer) {
            peer.reconnectToPeer();
        }
        peer.reconnectToPeer();
        socket.emit('user_join', { from: currentUser, roomId: e._id + "_" + currentUser, to: e._id,username:user.username});
        setCalling(true);
        setRemoteUser(e.username);

    };

    const fetchTheUserJoinRequest = (e) => {
        if (currentUser == e.to) {
            if (!peer.peer) {
                peer.reconnectToPeer();
            }
            setRemoteSocket(e.id);
            setSelectedUser(e.from);
            setCalling(true);
            setRemoteUser(e.username);
        } else {
            console.log('Unknown request')
        }
    }

    const fetchUserRequest = async (e) => {
        setJoinRoom(e);
        setCalling(false);
        showUserMedia(e);
    }

    const fetchUserJoin = useCallback((e) => {
        // setJoinRoom(e);
        // setRemoteSocket(e.id);
    }, [socket]);


    const changeRoomStatus = () => {
        setJoinRoom(null);
    }
    const rejectTheCall=(e)=>{
        console.log(e);
        if(remoteUser && e.answer)
        {
            setJoinRoom(e);
            socket.emit('user__request__accept', { from: currentUser, roomId: currentUser + "_" + selectedUser, to: selectedUser });
        }
        else{
        setCalling(false);
        socket.emit('reject call',{to:selectedUser});
        }

    }
    const callReject = (e)=>{
        console.log(e);
        if(e.to == user.userId)
        {
            setCalling(false); 
        }
    }
    const showUserMedia = useCallback(async (e) => {
        setRemoteSocket(e.id);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const offer = await peer.getOffer();
        setStreams(stream);
        socket.emit('user call', { to: e.id, offer });//create an offer and send
    }, [socket, streams])

    const fetchOffer = useCallback(async (e) => {
        setRemoteSocket(e.from);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setStreams(stream);
        const answer = await peer.getAnswer(e.offer);
        socket.emit('call accept', { to: e.from, answer });
    }, [socket]);

    const sendStreams = useCallback(async () => {
        try {
            for (const track of streams.getTracks()) {
                peer.peer.addTrack(track, streams);//on call , we set tracks to send it to the user who called us so when we add tracks , an event listener is emitted called 'track' or we can go with peer.onTrack to add (remote tracks on user who called) 
            }
        } catch (e) {
            console.log(e);
        }
    }, [streams])

    const fetchUserAcceptance = useCallback(async (e) => {
        await peer.setRemoteDescriptionForlocal(e.answer);
        await sendStreams();
    }, [sendStreams]);


    const handleNegotiation = useCallback(async (e) => {
        const answer = await peer.getAnswer(e.offer);
        socket.emit('negotiation completed', { to: e.from, answer });
        sendStreams();
    }, [socket, sendStreams]);

    const handleNegotiationCheck = useCallback(async (e) => {
        await peer.setRemoteDescriptionForlocal(e.answer);
    }, [socket]);

    const handleNegotiationForEvent = useCallback(async (e) => {
        console.log(e);
        const offer = await peer.getOffer();
        socket.emit('negotiation', { offer, to: remoteSocket });
    }, [remoteSocket, socket]);

    const disconnectTheCall = () => {
        try {
            peer.disconnectCall();
            socket.emit('disconnect call', { to: remoteSocket });
            changeRoomStatus();
        }
        catch (e) {

        }
    }

    const disconnectTheCallFromCallee = (e) => {
        changeRoomStatus();
    }

    const onMute = () => {
        
        streams.getTracks().forEach(track => {
            if (track.kind == 'audio') {
                track.enabled = !track.enabled;
                setAudioState(track.enabled);
            }
        });
    };
    const onVideoDisable = () => {
        streams.getTracks().forEach(track => {
            if (track.kind == 'video') {
                track.enabled = !track.enabled;
                setVideoState(track.enabled);
            }
        });
    }

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegotiationForEvent);
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegotiationForEvent);
        }
    }, [handleNegotiationForEvent])

    useEffect(() => {
        peer.peer.addEventListener('track', async (e) => {
            const remoteStream = e.streams;
            setRemoteStream(remoteStream[0]);
            console.log(remoteStream);
        })
    }, [])
    useEffect(() => {
        if (socket) {
            socket.on('user__request__accept', fetchUserRequest);
            socket.on('user__request', fetchTheUserJoinRequest);
            socket.on('user joined', fetchUserJoin);
            socket.on('incoming call', fetchOffer);
            socket.on('call accept', fetchUserAcceptance)
            socket.on('negotiation', handleNegotiation)
            socket.on('negotiation completed', handleNegotiationCheck);
            socket.on('disconnect call', disconnectTheCallFromCallee);
            socket.on('reject the call',callReject);

            return () => {
                socket.off('user__request__accept', fetchUserRequest);
                socket.off('user__request', fetchTheUserJoinRequest);
                socket.off('user joined', fetchUserJoin);
                socket.off('incoming call', fetchOffer);
                socket.off('call accept', fetchUserAcceptance);
                socket.off('negotiation', handleNegotiation)
                socket.off('negotiation completed', handleNegotiationCheck);
                socket.off('disconnect call', disconnectTheCallFromCallee);
                socket.off('reject the call',callReject)


            }
        }
    }, [socket, fetchUserJoin, fetchOffer, fetchUserAcceptance, handleNegotiation, handleNegotiationCheck, fetchUserRequest, fetchTheUserJoinRequest])
    return (
        <div className="video__room" >
            {
                joinRoom ? (
                    <div className="video__room__container" >
                        <div className="video__playing__container">
                            {
                                streams && videoEnabled ?
                                    (<ReactPlayer playing className="stream" height="400px" width="50%" url={streams} />)
                                    : (<img src={CameraDisabled} alt="Camera disabled" width="400px" height="20%" />)
                            }
                            {
                                remoteStream &&  (<ReactPlayer playing className="rstream" height="400px" width="50%" url={remoteStream} />)
                                // :(<img src={CameraDisabled} alt="Camera disabled" width="50%" height="400px"/>)

                            }

                        </div>
                        <div className="button__container">
                            <div className="button button--mute" onClick={onMute}>{!audioEnabled?(<AiOutlineAudioMuted />):(<FaMicrophoneAlt/>)}</div>
                            <div className="button button--video" onClick={onVideoDisable}>{!videoEnabled?(<FaVideoSlash />):(<FaVideo/>)}</div>
                            <div className="button button--disconnect" onClick={changeRoomStatus}><PiPhoneDisconnectThin /></div>
                        </div>
                    </div>
                ) :
                    (

                        <div className="video__component">
                            {
                                calling ? (<ShowCallScreen  to={remoteUser} rejectTheCall={rejectTheCall} innerText={!selectedUser && "Calling"} remoteUser={selectedUser}/>) : (
                                    <div className="join__room__form">
                                        <div className="join__room__form__container">
                                            {
                                                users?.users?.map((user) => (
                                                    <div className="video__page--user__container" key={user._id} onClick={() => handleJoin({ email: user.email, _id: user._id,username:user.username })}>
                                                        <div className="user__avatar">

                                                        </div>
                                                        <div className="user__name">{user.username}</div>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    )
            }

        </div>
    )
};
export default VideoRoom;