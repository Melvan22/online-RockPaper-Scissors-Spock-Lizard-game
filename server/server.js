const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// порт
const port = 4001

const app = express()

// экзепляр сервера
const server = http.createServer(app)

// создание сокета на основе экземпляра сервера
const io = socketIO(server)
// map для хранения ответов играющих соперников, ключом является номер комнаты, в которой будут "находится" пары играющих
const map = new Map()

// начало обработки входях соединений
io.on('connection', socket => {
  console.log('user connected')
  //событие для инициирования новой игры
  socket.on('new_game', (nickname) => {
    //создаём комнату с названием, совпадающим с id сокета клиента, инициирующего новую игру, и присоединяем его в эту комнату
    socket.join(socket.id);
    //отправляем назад ответ с пометкой invitationLink, который будет учавствовать в формировании пригласительной ссылки для оппонента (по сути id сокета начавшего игру является частью  ссылки)
    io.sockets.in(socket.id).emit('invitationLink', socket.id);
  })

  //событие для подключения оппонента к игре
  socket.on('join_game', (room) => {
    //сразу присоединяем его к нужной комнате
    socket.join(room);
    //отправляем всем в комнате сообщение о том, что игру можно начинать (так как оба игрока уже тут)
    io.sockets.in(room).emit('start_game', room);
    //создаём место под ответы игроков в map
    var a = new Array(2)
    map.set(room, a)
  })

  //событие для повторного присоединения в комнате
  socket.on('join_game_again', (room) => {

    socket.join(room);
  })

  //событие ответа первого игрока
  socket.on('first_player_gesture', (gesture, room) => {
    //достаём из map нужную запись
    var a = new Array(2);
    a = map.get(room);
    //записываем в неё ответ
    a[0] = gesture;
    map.set(room,a);
    //снова достаём запись из map
    a = map.get(room);
    //и проверяем, есть ли оба ответа
    if(a[0]!=undefined && a[1]!= undefined){
      //если оба ответа есть, выявляем победителя
      //сначала проверяем, равны ли ответы
      if(a[0]==a[1]){
        //если равны, то у нас ничья и отправляем игрокам соответствующее сообщение (0 - ничья)
        io.sockets.in(room).emit('result', '0', room);
      }
      else if(a[0] == "Rock"){
        //проверяем, если первый игрок выбрал Камень
        if(a[1]=="Scissors" || a[1]=="Lizard"){
          //в случае выбора второго игрока Нижницв или Ящерица, первый игрок победил, отправляем игрокам соответствующее сообщение (1 - первый игрок победил)
          io.sockets.in(room).emit('result', '1', room);
        } else {
          //иначе отправляем сообщение о победе второго игрока (2 - второй игрок победил)
          io.sockets.in(room).emit('result', '2', room);
        }
        //далее аналогично со всеми вариантами
      } else if(a[0] == "Paper"){
        if(a[1]=="Rock" || a[1]=="Spock"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      } else if(a[0] == "Scissors"){
        if(a[1]=="Paper" || a[1]=="Lizard"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      } else if(a[0] == "Lizard"){
        if(a[1]=="Paper" || a[1]=="Spock"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      } else if(a[0] == "Spock"){
        if(a[1]=="Rock" || a[1]=="Scissors"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      }
    }
  })
  //событие ответа второго игрока, обрабатывается аналогично событию ответа первого игрока
  //оба события необходимы, так как неизвестно кто ответит раньше, а кто позже
  
  socket.on('second_player_gesture', (gesture, room) => {
    console.log('second_player_gesture : ' + gesture + ' '+ room);
    var a = new Array(2);
    a = map.get(room);
    a[1] = gesture;
    map.set(room,a);
    a = map.get(room);
    console.log(a[0] + ' ' + a[1])
    if(a[0]!=undefined && a[1]!= undefined){
      if(a[0]==a[1]){
        io.sockets.in(room).emit('result', '0', room);
      }
      else if(a[0] == "Rock"){
        if(a[1]=="Scissors" || a[1]=="Lizard"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      } else if(a[0] == "Paper"){
        if(a[1]=="Rock" || a[1]=="Spock"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      } else if(a[0] == "Scissors"){
        if(a[1]=="Paper" || a[1]=="Lizard"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      } else if(a[0] == "Lizard"){
        if(a[1]=="Paper" || a[1]=="Spock"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      } else if(a[0] == "Spock"){
        if(a[1]=="Rock" || a[1]=="Scissors"){
          io.sockets.in(room).emit('result', '1', room);
        } else {
          io.sockets.in(room).emit('result', '2', room);
        }
      }
      
    }
  })
  //событие при отключении клиента
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))