import React from 'react';
import * as actionTypes from '../actions/taskActions';

let initialstate = [];
export const taskReducer = (state=initialstate,action)=>
{
  switch(action.type)
  {
      case actionTypes.lookupTable.FETCH_USER:
           return action.payload;//stores the response in store as state so initially [] is state each time we dispatch an action state is updated
      case actionTypes.lookupTable.ADD_USER:
           return [...state,action.payload]
      default:
          return state;
  }
};