import logo from './logo.svg';
import './App.css';


import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router';
import { Main } from './components/main';
import HomePage from './components/homePage'
import { Provider } from 'react-redux';
import Store from './store';
import {SocketContext,Socket} from './socket/socketConnection';
import {UserContext} from './socket/loginContext';
import { useState } from 'react';


function App() {
  const [user, setUser] = useState({
    isLogged: false,
    userId: null
  });
  const [socket,setSocket]  = useState('');
  return (
    <BrowserRouter>

    <UserContext.Provider value={[ user, setUser ]}>
      <SocketContext.Provider value={[socket,setSocket]}>
        <Provider store={Store}>
            <Routes>
              <Route exact path="" Component={Main} />
              <Route path="home" Component={HomePage} />
            </Routes>
        </Provider>
      </SocketContext.Provider>
    </UserContext.Provider>
    </BrowserRouter>

  );
}

export default App;
