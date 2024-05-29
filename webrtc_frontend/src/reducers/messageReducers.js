import React from 'react';
import * as actionTypes from '../actions/taskActions';

const initialState=[];
export const MessageReducers = (state=initialState,action)=>{
    console.log(state);
    switch(action.type){
        case actionTypes.lookupTable.FETCH_CHATS:
            console.log(action.payload);
            return action.payload;
        case actionTypes.lookupTable.ADD_CHATS:
            return [...state,action.payload];
        default:
            return state;
    }
}