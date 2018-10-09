import React, { Component } from 'react';
import './LoserScreen.css';
//компонт, отображающий результат игры "проигравший"
class LoserScreen extends Component {
    constructor() {
      super()
    }
    
    render() {
       return (
            <div>
                <div className = "PrettyFont">
                  You lose!
                </div>
            </div>
      );
    }
  }
  
  export default LoserScreen;