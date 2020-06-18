var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/join.html');
});

app.post('/', (req, res) => {
  user = req.body.username
  res.redirect('/news');
})

let users = 0;
const identities = {}

app.get('/news', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.of('/news').on('connection', function (socket) {

  users += 1;
  socket.broadcast.emit('users', users);
  socket.emit('users', users);

  socket.on('join', function (data) {
    socket.emit('joined', data)
    socket.broadcast.emit('joined', data)
    identities[socket.id] = data;
  });

  socket.on('chat message', function (user, msg) {
    socket.emit('chat message', user, msg);
    socket.broadcast.emit('chat message', user, msg);
  });

  socket.on('user image', function (user, msg) {
    socket.emit('user image', user, msg);
    socket.broadcast.emit('user image', user, msg);
  });

  socket.on('great message', function (user, pic, msg) {
    socket.emit('great message', user, pic, msg);
    socket.broadcast.emit('great message', user, pic, msg);
  })

  socket.on('disconnect', () => {
    users -= 1;
    socket.broadcast.emit('users', users);
    socket.broadcast.emit('left', `${identities[socket.id]} Left`);
    delete identities[socket.id];
  })
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
