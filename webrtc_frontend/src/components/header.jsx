import React from 'react';
import Logo from '../assets/logoBG.png';
const Header = function(){
    return(
    <header>
        <div className="header-container w-100 h-20 d-flex">
            <div className="logo">
              <img src={Logo} alt="logo" width="50px" />
            </div>
            <div className="brand-name">
              <h5>Connect</h5>
            </div>
        </div>
    </header>
    )
};

export default Header;