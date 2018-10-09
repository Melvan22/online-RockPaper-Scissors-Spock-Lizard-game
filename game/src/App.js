import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
import './App.css';
import WaitingScreen from './WaitingScreen';
import Game from './Game';

class App extends Component {
  constructor() {
    super()
    this.state = {
      endpoint: "http://localhost:4001", //для подключения к серверу
      clientpoint : "http://localhost:3000", //для формирования пригласительной ссылки
      isFirstPlayer: true, //для идентификации, когда необходимо рендерить компонент игры
      invitationLink: '', //для пригласительной ссылки
      room: ''          //для id socket-комнаты на сервере
    }
    //создаём сокет
    const socket = socketIOClient(this.state.endpoint)
    //отправляем сообщение об инициировании новой игры
    socket.emit('new_game',"nick") 
    //обработка события о приходе id комнаты для формирования пригласительной ссылки
    socket.on('invitationLink', (link) => {
      //формируем пригласительную ссылку
      this.setState({invitationLink : this.state.clientpoint + '/invite/' + link})
      //записываем номер комнаты
      this.setState({room: link})
    })
    //событие начала игры
    socket.on('start_game', (room) => {
      //меняем state чтобы начать рендерить компонент игры
      this.setState({isFirstPlayer : false})
    })
  }
  
  render() {
    //проверка, рендерим начальный экран или компонент игры
    if (this.state.isFirstPlayer === true ) return (
      <div>
        //компонент начального экрана
      <WaitingScreen/>
      //отображение пригласительной ссылки
      <div className = "LinkFont">Invitation link for your opponent: {this.state.invitationLink} </div>
      </div>
    );
     else return (
       //компонент игры
      <Game room={this.state.room} isFirstPlayer = {this.state.isFirstPlayer} />
    );
  }
}

export default App;
