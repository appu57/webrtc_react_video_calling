import { useContext, useEffect, useState } from 'react';
import { Tabs,Tab} from 'react-bootstrap';
import MainChatPage from './chatComponents/MainChatPage';
import { Main } from './main';
import Logo from '../assets/logoBG.png';
import {UserContext} from '../socket/loginContext';
import { io } from 'socket.io-client';
import {SocketContext} from '../socket/socketConnection';
import { useDispatch, useSelector } from "react-redux";
import { lookupTable } from "../actions/taskActions";
import axios from 'axios';
import VideoRoom from './videoComponents/VideoRoom';


const HomePage = ({setToken})=>{
    const [selectedTab , setSelectedTab] = useState('tab1');
    let [user,setUser] = useContext(UserContext);
    let dispatch = useDispatch();
    const setUserLoggedOut = (e)=>{
        console.log(user);
        setUser({
            isLogged:false,
            userId:null
        })
        setToken(null);
    }

    const onTabSelect = (e)=>{
        setSelectedTab(e);
    }

    useEffect(()=>{
        let currentUser= localStorage.getItem('userId');
        const fetchUsers = async ()=>{
            const response =await axios.post('http://localhost:3000/users/getUsers',{userId:currentUser});
            dispatch({type:lookupTable.FETCH_USER,payload:response.data});
        };
        fetchUsers();
    },[])
    return(
       <div className="tab__container">
           <div className="tab__header">
               <div className="brand">
               <img src={Logo} alt="logo" width="50px" />
                   <p>Connect</p>
                </div>
               <div className="logout" onClick={setUserLoggedOut}><p>Logout</p></div>
           </div>
        <div className="tabs">
        <Tabs activeKey={selectedTab} onSelect={onTabSelect} onScroll={event=>event.stopPropagation()}>
           <Tab eventKey="tab1" title="VIDEO CALL" >
               <VideoRoom/>
           </Tab>
           <Tab eventKey="tab2" title="CHATS" >
               <MainChatPage/>
           </Tab>
        </Tabs>
        </div>
        
        </div>

    );
}

export default HomePage;