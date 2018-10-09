import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
import  './Game.css';
import WaitingScreen from './WaitingScreen';
import WinnerScreen from './WinnerScreen';
import DrawScreen from './DrawScreen';
import LoserScreen from './LoserScreen';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
//компонент игры
class Game extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      endpoint: "http://localhost:4001", //для подключения к серверу
      isFirstPlayer: false, //для идентификации, первый игрок или второй (первый - тот кто создал игру, второй - тот кто к ней присоединился)
      room: '',             //для id socket-комнаты на сервере
      whoWin: '',           //для хранения результата игры
      isAnswered: false     //для проверки, ответил игрок или нет
    }
    //создаём сокет
    const socket = socketIOClient(this.state.endpoint);
    //проверяем, первый это игрок или второй
    if(this.props.isFirstPlayer == undefined){
      //если второй, то присоединяемся к игре, доставая id комнаты из ссылки
      socket.emit('join_game',this.props.match.params.room);
      this.state.room = this.props.match.params.room;
    }
    else {
      //иначе заново присоединяемся к комнате, так как здесь - первый игрок, и объект сокета пропал при переходе из одного компонента к другому (не придумал/не нашёл как его передать в другой компонент, ничего кроме такого костыля на ум не пришло)
      this.state.isFirstPlayer = true;
      this.state.room = this.props.room;
      socket.emit('join_game_again',this.props.room);
    }
 //событие принятия от сервера результатов игры
    socket.on('result', (winner, room) => {
      //если комнаты совпадают
      if(this.state.room == room){
        //устанавливаем результат игры
        this.setState({whoWin : winner})
      }
    })

  }
  //отправка выбора на сервер
  sendGesture = (gesture) => {
    if(this.state.isFirstPlayer == true){
      //отправка ответа, если сдесь первый игрок
      const socket = socketIOClient(this.state.endpoint)
      socket.emit('first_player_gesture', gesture, this.state.room,)
      //помечаем, что мы ответили
      this.setState({isAnswered : true})
    }
    else {
      //отправка ответа, если сдесь второй игрок
      const socket = socketIOClient(this.state.endpoint)
      socket.emit('second_player_gesture', gesture, this.state.room,)
      //помечаем, что мы ответили
      this.setState({isAnswered : true})
    }
  }

  
  render() {
    //если ещё не ответили, рисуем поле с выбором вариантов
   if (this.state.isAnswered == false) return (
      <div align="center"> 
        <div className="ChooseGestureFont">Choose a gesture:</div>
        <div className="Gallery">
        <div className= "Container"><img className= "Image" title = "Rock" src="/images/rock.jpg" alt="Rock" onClick={() => this.sendGesture('Rock')}/></div>
        <div className= "Container"><img className= "Image" title = "Paper" src="/images/paper.jpg" alt="Paper" onClick={() => this.sendGesture('Paper')}/></div>
        <div className= "Container"><img className= "Image" title = "Scissors" src="/images/scissors.jpg" alt="Scissors" onClick={() => this.sendGesture('Scissors')}/></div>
        <div className= "Container"><img className= "Image" title = "Spock" src="/images/spock.jpg" alt="Spock" onClick={() => this.sendGesture('Spock')}/></div>
        <div className= "Container"><img className= "Image" title = "Lizard" src="/images/lizard.jpg" alt="Lizard" onClick={() => this.sendGesture('Lizard')}/></div>
        </div>
      </div>
    );
    //иначе рисуем другие компоненты в зависимости от результата игры
    else if(this.state.whoWin != '') switch(this.state.whoWin){
      //ничья
      case '0':return (
        <div> 
          <DrawScreen/>
        </div>
      );
      //победил первый игрок (мы)
      case '1': {
        if(this.state.isFirstPlayer == true) return (
        <div> 
          <WinnerScreen/>
        </div>
      );
      //победил второй игрок (не мы)
      else return (
        <div> 
          <LoserScreen/>
        </div>
      );
    }
      //победил второй игрок (мы)
      case '2':{
        if(this.state.isFirstPlayer == false) return (
        <div> 
          <WinnerScreen/>
        </div>
      );
      //победил первый игрок (не мы)
      else return (
        <div> 
          <LoserScreen/>
        </div>
      );
    }

    }
    //иначе рисуем компонент ожидания
    else return(
      <div> 
        <WaitingScreen/>
      </div>
    );
  }
}

export default Game;
