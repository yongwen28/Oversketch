var express= require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser');
    users = [],
    connections = [];
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.post('/createGameRoom', function(req, res){
    var roomName = req.body.roomName;
    res.sendFile(__dirname + '/gameRoom.html', {roomName: roomName})
});



io.sockets.on('connection', function(socket){
    //Connect
    socket.on('room', function(room){
        socket.join(room);
    });
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
        data.messageVal = data.user + ': ' + data.messageVal;
        io.sockets.in(data.roomName).emit('new message', {msg: data.messageVal});
    })
});

server.listen(8000, function(req, res){
    console.log('Server is running on port 8000')
});



