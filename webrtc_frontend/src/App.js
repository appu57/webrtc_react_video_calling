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
import SocketContext,{socket} from './socket/socketConnection';
import UserContext from './socket/loginContext';
import { useState } from 'react';


function App() {
  const [user, setUser] = useState({
    isLogged: false,
    userId: null
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SocketContext.Provider value={socket}>
        <Provider store={Store}>
          <BrowserRouter>
            <Routes>
              <Route exact path="" Component={Main} />
              <Route path="home" Component={HomePage} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </SocketContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
