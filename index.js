var express= require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [],
    connections = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.get('/gameRoom', function(req, res){
    res.sendFile(__dirname + '/gameRoom.html')
});

io.sockets.on('connection', function(socket){
    //Connect
    connections.push(socket);
    console.log('Connected %s sockets connected', connections.length);
    //Disconnect
    socket.on('disconnect', function () {
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length)
    });
    //Send
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data});
    })
});

server.listen(8000, function(req, res){
    console.log('Server is running on port 8000')
});



