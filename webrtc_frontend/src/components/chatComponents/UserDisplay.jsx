const UserDisplay = (props)=>{
    console.log(props);
    const {_id , username } = props;
    return(
   <div className="user__container" id={_id}>
       <div className="user__image__container">
         <div className="circle"></div>
         <span class="status__indicator"></span>
       </div>
       <div className="user__name__container">
         <p>{username}</p>
       </div>
   </div>
    
    );
}
export default UserDisplay;