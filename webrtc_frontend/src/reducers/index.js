import {taskReducer} from './reducers';
import {combineReducers} from 'redux';
var reducer = combineReducers({users:taskReducer});
export default reducer;