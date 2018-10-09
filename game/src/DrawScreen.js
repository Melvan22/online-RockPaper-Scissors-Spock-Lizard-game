import React, { Component } from 'react';
import './DrawScreen.css';
//компонт, отображающий результат игры "ничья"
class DrawScreen extends Component {
    constructor() {
      super()
    }
    
    render() {
       return (
            <div>
                <div className = "PrettyFont" >
                It's a draw!
                </div>
            </div>
      );
    }
  }
  
  export default DrawScreen;