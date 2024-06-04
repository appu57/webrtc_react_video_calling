import React from 'react';
import { useSocket } from '../../socket/socketConnection';
import { useContext, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import peer from '../webrtcService';

const VideoRoom = ({ changeJoinRoom }) => {
    const socket = useSocket();
    const [remoteSocket,setRemoteSocket] = useState(null);
    const [stream,setStream] = useState(null);
    const [remoteStream,setRemoteStream] = useState(null);


    const fetchUserJoin =(e)=>{
        setRemoteSocket(e.id)
       console.log(e);
    }
    const showUserMedia =async (e)=>{
        const stream =await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        console.log(remoteSocket);
        const offer = await peer.getOffer();
        socket.emit('user call',{to:remoteSocket,offer});//create an offer and send
        setStream(stream);
    }
    const fetchOffer=async (e)=>{
      const answer = await peer.getAnswer(e.offer);
      const stream =await navigator.mediaDevices.getUserMedia({audio:true,video:true});
      setStream(stream);
      setRemoteSocket(e.from);
      socket.emit('call accept',{to:e.from,answer});
    }
    const fetchUserAcceptance=async (e)=>{
       await peer.setRemoteDescriptionForlocal(e.answer);
       for(const track of stream.getTracks())
       {
           peer.peer.addTrack(track,stream);
       }
    }

    useEffect(()=>{
        peer.peer.addEventListener('track', async (e)=>{
            //once rtc peer connection is established it sends an event called onTrack,addTrack check angular video call
            const remoteStream = e.streams;
            setRemoteStream(remoteStream);
        })
    },[])
    useEffect(() => {
        socket.on('user joined',fetchUserJoin);
        socket.on('incoming call',fetchOffer);
        socket.on('call accept',fetchUserAcceptance)
        return () => {
            socket.off('user joined');
            socket.off('incoming call');
            socket.off('call accept')
        }
    }, [socket])
    return (
        <div className="video__room" >
            <h1 onClick={changeJoinRoom}>Video Room </h1>
            <h4>{remoteSocket ? 'Connected':'No users have joined'}</h4>
            {
               remoteSocket && <button className="btn" onClick={showUserMedia}>Call</button>
            }
            {
                stream && (<ReactPlayer playing height="400px" width="500px" url={stream}/>)
            }
            {
                remoteStream && (<ReactPlayer playing height="400px" width="500px" url={remoteStream}/>)
            }
        </div>
    )
};
export default VideoRoom;