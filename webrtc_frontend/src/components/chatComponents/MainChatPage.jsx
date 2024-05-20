import { useEffect, useState ,useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import { lookupTable } from "../../actions/taskActions";
import axios from 'axios';
import UserDisplay from './UserDisplay';
import ChatComponent from './chatComponent';
import UserContext from '../../socket/loginContext';

const MainChatPage = () =>{
    let state = useSelector(state=>state.users);//on load of MainChatPage in the useEffect the api is called and dispatched to store which has reducers and reducer now sends user data to all component
    let [selectedUser,setSelectedUser] = useState("");
    let dispatch = useDispatch();
    useEffect( ()=>{
        const fetchUsers = async ()=>{
            const response =await axios.get('http://localhost:3000/users/getUsers');
            dispatch({type:lookupTable.FETCH_USER,payload:response.data});
        };
        fetchUsers();
    },[]);

    const setSelectedUsers = (e)=>{
        console.log(e);
        setSelectedUser(e);
    }
    return(
       <div className="chat__container">
           <div className="users__container">
             {state?.users?.map((user,index)=>(
                <UserDisplay key={index} {...user} setUsers={setSelectedUsers} />
             ))}
           </div>
           <ChatComponent user={selectedUser}/>
       </div>
    );
}
export default MainChatPage;