import logo from './logo.svg';
import './App.css';


import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import {BrowserRouter} from 'react-router-dom'
import {Routes} from 'react-router';
import {Header} from './components/header';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
