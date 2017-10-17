var express= require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser');
    users = [],
    connections = [];
    rooms = [];
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});

app.post('/createGameRoom', function(req, res){
    var roomName = req.body.roomName;
    if (rooms.indexOf(roomName) === -1){
        rooms.push(roomName);
    } else {
        res.send("Room name is already taken")
    }
    res.render('gameRoom.ejs', {roomName: roomName})
});

app.post('/joinGameRoom', function(req, res){
    var roomName = req.body.roomName;
    if (rooms.indexOf(roomName) === -1) {
        res.send("Room does not exist");
    }
    res.render('gameRoom.ejs', {roomName: roomName})
});

var line_history = [];

io.sockets.on('connection', function(socket){
    //Connect
    socket.on('room', function(room){
        socket.join(room);
    });
    connections.push(socket);
    console.log('Connected %s sockets connected', connections.length);
    socket.on('new user', function(data){
        console.log(data);
        io.sockets.in(data.roomName).emit('add user', {msg: data.user})
    });
    // first send the history to the new client
    for (var i in line_history) {
        socket.emit('draw_line', { line: line_history[i] } );
    }
    // add handler for message type "draw_line".
    socket.on('draw_line', function (data) {
        // add received line to history
        line_history.push(data.line);
        // send line to all clients
        io.emit('draw_line', { line: data.line });
    });
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



