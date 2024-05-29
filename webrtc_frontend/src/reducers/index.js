import {taskReducer} from './reducers';
import {MessageReducers} from './messageReducers';

import {combineReducers} from 'redux';
var reducer = combineReducers({users:taskReducer,messageState:MessageReducers});
export default reducer;