import React from 'react';{/* use export const FETCH_USER="fetch user " or create a lookup table  */}
export const lookupTable ={ 
    FETCH_USER:"fetch_users",
    ADD_USER :"add_users",
    FETCH_CHATS:"fetch_chats",
    ADD_CHATS:"add_chats",
    DELETE_CHATS:"delete_chats"
}

export const addUser = (userdata)=>{
    return {
        type:lookupTable.ADD_USER,
        payload:userdata
    }
};