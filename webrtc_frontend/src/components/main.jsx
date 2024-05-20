import React,{useContext} from 'react';
import RegisterForm from './registerForm';
import Header from './header';
import WebrtcImage from '../assets/webrtc_image.png';


export const Main = function(){
   return(
       <div className="main-container w-100">
           <Header/>
           <div className="tagline-container w-100 h-20">
               <p><strong>Connect</strong> presents to you a seamless video calling and chatting platform</p>
           </div>
           <section>
               <div className="section-container">
                   <div className="image-container mx-auto">
                       <img src={WebrtcImage} alt=""/>
                   </div>
                    <RegisterForm/>
               </div>
           </section>
       </div>
   )
};