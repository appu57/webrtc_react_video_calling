import { useState } from 'react';
import { Tabs,Tab} from 'react-bootstrap';
import MainChatPage from './chatComponents/MainChatPage';
import { Main } from './main';
import Logo from '../assets/logoBG.png';

const HomePage = ()=>{
    const [selectedTab , setSelectedTab] = useState('tab1');
    return(
       <div className="tab__container">
           <div className="tab__header">
               <div className="brand">
               <img src={Logo} alt="logo" width="50px" />
                   <p>Connect</p>
                </div>
               <div className="logout"><p>Logout</p></div>
           </div>
        <div className="tabs">
        <Tabs activeKey={selectedTab} onSelect={key =>setSelectedTab(key)}>
           <Tab eventKey="tab1" title="VIDEO CALL" style={{width:'50%'}}>
               Content for Tab 1
           </Tab>
           <Tab eventKey="tab2" title="CHATS"style={{width:'50%'}}>
               <MainChatPage/>
           </Tab>
        </Tabs>
        </div>
        
        </div>

    );
}

export default HomePage;