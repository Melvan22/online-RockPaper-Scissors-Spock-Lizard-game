import React, { Component } from 'react';
import './WaitingScreen.css';
//компонт, отображающий ожидание (присоединения оппонента к игре или ответа от оппонента)
class WaitingScreen extends Component {
    constructor() {
      super()
    }
    
    render() {
       return (
         <div>
            <div className = "PrettyFont" >
               Waiting for your opponent ...
            </div>
        </div>
      );
    }
  }
  
  export default WaitingScreen;