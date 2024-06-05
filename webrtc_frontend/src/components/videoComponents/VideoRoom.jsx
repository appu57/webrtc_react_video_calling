import React from 'react';
import { useSocket } from '../../socket/socketConnection';
import { useContext, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import peer from '../webrtcService';

const VideoRoom = ({ changeJoinRoom }) => {
    const socket = useSocket();
    const [remoteSocket,setRemoteSocket] = useState(null);
    const [streams,setStreams] = useState(null);
    const [remoteStream,setRemoteStream] = useState(null);


    const fetchUserJoin =(e)=>{
        setRemoteSocket(e.id)
    }
    const showUserMedia =async (e)=>{
        const stream =await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        const offer = await peer.getOffer();
        socket.emit('user call',{to:remoteSocket,offer});//create an offer and send
        setStreams(stream);
    }
    const fetchOffer= useCallback(async (e)=>{
      setRemoteSocket(e.from);
      const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
      setStreams(stream);
      console.log(streams);
      const answer = await peer.getAnswer(e.offer);
      socket.emit('call accept',{to:e.from,answer});
    },[socket]);

    const sendStreams = useCallback(async()=>{
        try{
        for(const track of streams.getTracks())
        {
            peer.peer.addTrack(track,streams);//on call , we set tracks to send it to the user who called us so when we add tracks , an event listener is emitted called 'track' or we can go with peer.onTrack to add (remote tracks on user who called) 
        }
    }catch(e)
    {
        console.log(e);
    }
    },[streams])

    const fetchUserAcceptance= useCallback(async(e)=>{
       await peer.setRemoteDescriptionForlocal(e.answer);
       sendStreams();
    },[sendStreams]);


    const handleNegotiation=useCallback(async (e)=>{
        const answer = await peer.getAnswer(e.offer);
        socket.emit('negotiation completed',{to:e.from,answer});
    },[socket]);

    const handleNegotiationCheck= useCallback(async (e)=>{
      await peer.setRemoteDescriptionForlocal(e.answer);
    },[]);

    const handleNegotiationForEvent =useCallback(async()=>{
        const offer = await peer.getOffer();
        socket.emit('negotiation',{offer,to:remoteSocket});  
    },[remoteSocket,socket]);

    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded',handleNegotiationForEvent);
        return ()=>{
            peer.peer.removeEventListener('negotiationneeded',handleNegotiationForEvent);
        }
   },[handleNegotiationForEvent])

    useEffect(()=>{
        peer.peer.addEventListener('track', async (e)=>{
            //once rtc peer connection is established it sends an event called onTrack,addTrack check angular video call
            const remoteStream = e.streams;
            setRemoteStream(remoteStream[0]);
        })
    },[])
    useEffect(() => {
        socket.on('user joined',fetchUserJoin);
        socket.on('incoming call',fetchOffer);
        socket.on('call accept',fetchUserAcceptance)
        socket.on('negotiation',handleNegotiation)
        socket.on('negotiation completed',handleNegotiationCheck);

        return () => {
            socket.off('user joined',fetchUserJoin);
            socket.off('incoming call',fetchOffer);
            socket.off('call accept',fetchUserAcceptance);
            socket.off('negotiation',handleNegotiation)
            socket.off('negotiation completed',handleNegotiationCheck);

        }
    }, [socket,fetchUserJoin,fetchOffer,fetchUserAcceptance,handleNegotiation,handleNegotiationCheck])
    return (
        <div className="video__room" >
            <h1 onClick={changeJoinRoom}>Video Room </h1>
            <h4>{remoteSocket ? 'Connected':'No users have joined'}</h4>
            {
               streams && <button className="btn" onClick={sendStreams}>Send</button>
            }
            {
               remoteSocket && <button className="btn" onClick={showUserMedia}>Call</button>
            }
            {
                streams && (<ReactPlayer playing className="stream" height="400px" width="500px" url={streams}/>)
            }
            {
                remoteStream && (<ReactPlayer playing className="rstream" height="400px" width="500px" url={remoteStream}/>)
            }
        </div>
    )
};
export default VideoRoom;