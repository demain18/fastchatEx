  
var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    port     : '',
    database : 'fastchat'
});
db.connect();

var express = require('express');
var app = express();
 
var http = require('http');
var server = http.Server(app);
 
var socket = require('socket.io');
var io = socket(server);
 
var port = 5000;
var socketList = [];
var room = '';
 
io.on('connection', function(socket) {
    console.log('--------------------------------------------------');
    socketList.push(socket);
    var time = new Date();
    console.log('User Join, ', socket.id, time);

    socket.on('room', function(data) {
        // console.log(data);
        room = data;
        socket.join(data);
    });
 
    socket.on('SEND', function(data) {
        var time = new Date();
        console.log('--------------------------------------------------');
        console.log('time : ', time);
        console.log('user : ', data.user);
        console.log('msg : ', data.msg);
        console.log('room : ', room);
        console.log('socket : ', socket.id);

        socket.broadcast.to(room).emit('SEND', data);
        var userlist = [];

        var sql = "INSERT INTO `chat` (`user`, `text`, `time`) VALUES ('"+data.user+"', '"+data.msg+"', '"+time+"')";
        db.query(sql,function(err,rows,fields) {
        if(err) {
            console.log(err);
        }
        });

        socketList.forEach(function(item, i) {
            userlist.push(item.id);
        });
        console.log('socketList : ', userlist);
    });
 
    socket.on('disconnect', function() {
        console.log('--------------------------------------------------');
        var time = new Date();
        console.log('User left, ', socket.id, time);
        socketList.splice(socketList.indexOf(socket), 1);
        // socket.leave(room);
    });
});
 
server.listen(port, function() {
    console.log('Server On !');
});