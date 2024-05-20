const UserDisplay = (props)=>{
    console.log(props);
    let {_id , username ,setUsers} = props;
    username = username.split(" ").reduce((acc,curr)=>acc+(curr.charAt(0).toUpperCase()+curr.slice(1)));
    const sendSelectedUser=(e)=>{
      setUsers(username);
    }
    return(
   <div className="user__container" id={_id}  onClick={sendSelectedUser}>
       <div className="user__image__container">
         <div className="circle"></div>
         <div className="status__indicator"></div>
       </div>
       <div className="user__name__container">
         <p>{username}</p>
       </div>
   </div>
    
    );
}
export default UserDisplay;