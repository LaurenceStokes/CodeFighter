'use strict';

var io = require('socket.io'),
    User = require('../app/models/user'),
    onlineUsers = [];


module.exports = function(server) {

    var io = require('socket.io').listen(server),
        challenger;

    // io.set("transports", ["xhr-polling"]);
    // io.set("polling duration", 10);

    io.on('connection', function(socket) {

        socket.on('game:invite', function(userId) {

            console.log('User Connected');
            //If users in queue, take first user
            if (onlineUsers.length) {
                challenger = onlineUsers[0];
                onlineUsers.shift();
                io.sockets.connected[socket.id].emit('game:challengeAccepted', {socket: challenger.socket, challenge: 0});
                io.sockets.connected[challenger.socket].emit('game:challengeAccepted', {socket: socket.id, challenge: 0});
            } else {
                // if no users to challenge, add to queue.
                onlineUsers.push({
                    user: userId,
                    socket: socket.id,
                    inGame: false
                });
            }

        });

        socket.on('game:codeupdate', function(message) {
            io.sockets.connected[message.socket].emit('game:codeupdated', message.code);
        });

        socket.on('game:check', function(message){
             io.sockets.connected[message.socket].emit('game:lost');
             //User.update({'_id': message.user}, { $inc: { 'multi': 1} }, true);
             User.findByIdAndUpdate(message.user, {$inc: {multi: 1}},
            function (err, user) {
             console.log(user.multi);
            }
        );

        });

        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    });

};