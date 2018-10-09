import React, { Component } from 'react';
import './WinnerScreen.css';
//компонт, отображающий результат игры "победивший"
class WinnerScreen extends Component {
    constructor() {
      super()
    }
    
    render() {
       return (
            <div>
                <div className = "PrettyFont">
                You win!
                </div>
            </div>
      );
    }
  }
  
  export default WinnerScreen;