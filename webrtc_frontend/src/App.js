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
import {SocketProvider} from './socket/socketConnection';
import {UserContext} from './socket/loginContext';
import { useState } from 'react';


function App() {
  const [user, setUser] = useState({
    isLogged: false,
    userId: null
  });
  const [token,setToken]  = useState(null);
  return (
    <BrowserRouter>

    <UserContext.Provider value={[ user, setUser ]}>
        <Provider store={Store}>
        <SocketProvider  token={token}>
            <Routes>
              <Route path='/' element={<Main setToken={setToken}/>} />
              <Route path="home" element={token? <HomePage setToken ={setToken}/> : <Main setToken={setToken}/>} />
            </Routes>
            </SocketProvider>
        </Provider>
    </UserContext.Provider>
    </BrowserRouter>

  );
}

export default App;
