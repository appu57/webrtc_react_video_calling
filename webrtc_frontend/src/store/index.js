import {applyMiddleware,createStore} from 'redux';
import Reducers from '../reducers';
console.log(Reducers);
var Store = createStore(Reducers);
export default Store;