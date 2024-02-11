const http = require('http');
const express = require('express');
const app = express();
const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

const users = {};

io.on('connection',socket=>{
    socket.on('user-joined',(name)=>{
        users[socket.id] = name;
        socket.broadcast.emit('new-user',`${name} joined the chat !`);
    });

    socket.on('receive',(data)=>{
        socket.broadcast.emit('send',{userName: data.user, msg: data.msg});
    });

    socket.on('disconnect',(data)=>{
        socket.broadcast.emit('leave',{userName:users[socket.id],msg:'left the chat !'});
    })
    
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

server.listen(3000,()=>{
    console.log("Server is running at port 3000");
});