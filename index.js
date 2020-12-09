const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3000;
const cors = require('cors');

let arrayUsers = [];


const app = express();
app.use(cors());

const server = http.createServer(app);


const io = socketIo(server); // < Interesting!

io.on('connection', (socket) => {
   
   socket.on('username', (data) => {
      arrayUsers.push({
         ...data,
         id: socket.id
      });

      socket.emit('username', {
         ...data,
         id: socket.id,
         users: arrayUsers
      });
      socket.broadcast.emit('connected', arrayUsers);
      
   });

   socket.on('pmsg', (socketId, msg) => {
      socket.to(socketId).emit('pmsg', socket.id, msg);
   })

   socket.on('disconnect', () => {
      arrayUsers = [];
      socket.broadcast.emit('userout', 'user desconected');
   });
});






server.listen(port);

