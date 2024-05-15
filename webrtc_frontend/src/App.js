import logo from './logo.svg';
import './App.css';


import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import {BrowserRouter} from 'react-router-dom'
import {Routes , Route } from 'react-router';
import {Main} from './components/main';
import HomePage from './components/homePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="" Component={Main}/>
        <Route path="home" Component={HomePage}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
