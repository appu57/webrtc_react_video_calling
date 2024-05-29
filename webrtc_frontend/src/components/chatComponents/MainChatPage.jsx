import { useEffect, useState ,useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import { lookupTable } from "../../actions/taskActions";
import axios from 'axios';
import UserDisplay from './UserDisplay';
import ChatComponent from './chatComponent';
import {SocketContext} from '../../socket/socketConnection';
import { io } from 'socket.io-client';
import NoUser from './NoUserSelected';

const MainChatPage = () =>{
    let state = useSelector(state=>state.users);//on load of MainChatPage in the useEffect the api is called and dispatched to store which has reducers and reducer now sends user data to all component
    let [selectedUser,setSelectedUser] = useState({
        _id:null,
        username:null
    });
    let dispatch = useDispatch();
    let currentUser= localStorage.getItem('userId');

    const setSelectedUsers = async(_id,username)=>{
        setSelectedUser({
            _id:_id,
            username:username
        });
        try{
            const response =await axios.post('http://localhost:3000/message/getMessages',{senderId:currentUser,receiverId:_id});
            dispatch({type:lookupTable.FETCH_CHATS,payload:response.data.messages});
        }catch(e)
        {
              console.log(e);
        }
    }

    return(  
       <div className="chat__container" >
           <div className="users__container">
             {state?.users?.map((user,index)=>(
                <UserDisplay key={index} {...user} setUsers={setSelectedUsers} />
             ))}
           </div>
           {selectedUser._id ?(
           <ChatComponent user={selectedUser.username} key={selectedUser._id} id={selectedUser._id}/>
           ):(<NoUser/>)}
       </div>
    );
}
export default MainChatPage;