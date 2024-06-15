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


const VideoRoom = () => {
    const socket = useSocket();
    const [remoteSocket, setRemoteSocket] = useState(null);
    const [streams, setStreams] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [joinRoom, setJoinRoom] = useState(null);
    const [videoEnabled , setVideoState] = useState(true);
    const [remotevideoEnabled , setRemoteVideoState] = useState(true);


    const users = useSelector(state => state.users);

    const handleJoin = (e) => {
        console.log(peer);
        if(!peer.peer)
        {
            peer.reconnectToPeer();
        }
        peer.reconnectToPeer();
        const currentUser = localStorage.getItem('userId');
        console.log(e);
        setJoinRoom(e.email);
        socket.emit('user_join', { from: currentUser, roomId: e._id + "_" + currentUser, to: e._id });
    };

    const fetchTheUserCallRequest = (e) => {
        const currentUser = localStorage.getItem('userId');
        if (currentUser == e.to) {
            if(!peer.peer)
            {
                peer.reconnectToPeer();
            }
            setJoinRoom(e);
            setRemoteSocket(e.id);
            socket.emit('user__request__accept', { from: currentUser, roomId: currentUser + "_" + e.from, to: e.from });
        } else {
            console.log('Unknown request')
        }
    }

    const fetchUserRequest = async (e) => {
        showUserMedia(e);
    }

    const fetchUserJoin = useCallback((e) => {
        setJoinRoom(e);
        console.log(e);
        setRemoteSocket(e.id);
    }, [socket]);


    const changeRoomStatus = () => {
        setJoinRoom(null);
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

    const onMute =()=>{
        streams.getTracks().forEach(track=>{
            if(track.kind == 'audio')
            {
                track.enabled = !track.enabled;
            }
        });
    };
    const onVideoDisable=()=>{
        // const videoState = streams.getVidoTracks()[0].enabled;
        // streams.getVidoTracks()[0].enabled = !videoState;
        streams.getTracks().forEach(track=>{
            if(track.kind == 'video')
            {
                track.enabled = !track.enabled;
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
            //once rtc peer connection is established it sends an event called onTrack,addTrack check angular video call
            const remoteStream = e.streams;
            setRemoteStream(remoteStream[0]);
        })
    }, [])
    useEffect(() => {
        if (socket) {
            socket.on('user__request__accept', fetchUserRequest);
            socket.on('user__request', fetchTheUserCallRequest);
            socket.on('user joined', fetchUserJoin);
            socket.on('incoming call', fetchOffer);
            socket.on('call accept', fetchUserAcceptance)
            socket.on('negotiation', handleNegotiation)
            socket.on('negotiation completed', handleNegotiationCheck);
            socket.on('disconnect call', disconnectTheCallFromCallee);

            return () => {
                socket.off('user__request__accept', fetchUserRequest);
                socket.off('user__request', fetchTheUserCallRequest);
                socket.off('user joined', fetchUserJoin);
                socket.off('incoming call', fetchOffer);
                socket.off('call accept', fetchUserAcceptance);
                socket.off('negotiation', handleNegotiation)
                socket.off('negotiation completed', handleNegotiationCheck);
                socket.on('disconnect call', disconnectTheCallFromCallee);


            }
        }
    }, [socket, fetchUserJoin, fetchOffer, fetchUserAcceptance, handleNegotiation, handleNegotiationCheck, fetchUserRequest, fetchTheUserCallRequest])
    return (
        <div className="video__room" >
            {
                joinRoom ? (
                    <div className="video__room__container" >
                        <h1 onClick={changeRoomStatus}>Video Room </h1>
                        <div className="video__playing__container">
                            {
                                streams && videoEnabled ?
                                (<ReactPlayer playing className="stream" height="400px" width="500px" url={streams} />)
                                :(<img src={CameraDisabled} alt="Camera disabled" width="400px" height="400px"/>)
                            }
                            {
                                remoteStream && (<ReactPlayer playing className="rstream" height="400px" width="500px" url={remoteStream} />)
                                // :(<img src={CameraDisabled} alt="Camera disabled" width="400px" height="400px"/>)

                            }
                           
                        </div>
                        <div className="button__container">
                            <div className="button button--mute" onClick={onMute}><AiOutlineAudioMuted/></div>
                            <div className="button button--video" onClick={onVideoDisable}><FaVideoSlash/></div>
                            <div className="button button--disconnect" onClick={disconnectTheCall}><PiPhoneDisconnectThin/></div>
                            <div className="button button--chat"><IoChatboxEllipsesSharp/></div>

                        </div>
                    </div>
                ) :
                    (
                        <div className="video__component">
                            <div className="join__room__form">
                                <div className="join__room__form__container">
                                    {
                                        users?.users?.map((user) => (
                                            <div className="video__page--user__container" key={user._id} onClick={() => handleJoin({ email: user.email, _id: user._id })}>
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
                    )
            }

        </div>
    )
};
export default VideoRoom;