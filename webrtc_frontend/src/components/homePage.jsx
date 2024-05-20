import { useContext, useState } from 'react';
import { Tabs,Tab} from 'react-bootstrap';
import MainChatPage from './chatComponents/MainChatPage';
import { Main } from './main';
import Logo from '../assets/logoBG.png';
import UserContext from '../socket/loginContext';

const HomePage = ()=>{
    const [selectedTab , setSelectedTab] = useState('tab1');
    let currentUser = useContext(UserContext);
    const setUserLoggedOut = (e)=>{
        console.log(currentUser.user);

        currentUser.setUser({
            isLogged:false,
            userId:null
        })
    }
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
        <Tabs activeKey={selectedTab} onSelect={key =>setSelectedTab(key)} onScroll={event=>event.stopPropagation()}>
           <Tab eventKey="tab1" title="VIDEO CALL" style={{height:'545px',overflow:'hidden'}}>
               Content for Tab 1
           </Tab>
           <Tab eventKey="tab2" title="CHATS" style={{height:'545px',overflow:'hidden'}}>
               <MainChatPage/>
           </Tab>
        </Tabs>
        </div>
        
        </div>

    );
}

export default HomePage;