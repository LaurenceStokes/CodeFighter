'use strict';

var io = require('socket.io'),
    User = require('../app/models/user'),
    onlineUsers = [];


module.exports = function(server) {

    var io = require('socket.io').listen(server),
        challenger;

    // io.set("transports", ["xhr-polling"]);
    // io.set("polling duration", 10);
	
	
	// =====================================
	//  ON CONNECTION ======================
	// =====================================
    io.on('connection', function(socket) {
	
	
		// =====================================
		// MULTIPLAYER  ========================
		// =====================================

        socket.on('game:invite', function(userId) {

            console.log('User Connected');
            //If users in queue, take first user
            if (onlineUsers.length) {
                challenger = onlineUsers[0];
                onlineUsers.shift();
				//send the socket/s and the specific challenge both users will using
                io.sockets.connected[socket.id].emit('game:challengeAccepted', {socket: challenger.socket, challenge: 1});
                io.sockets.connected[challenger.socket].emit('game:challengeAccepted', {socket: socket.id, challenge: 1});
            } else {
                // if no users to challenge, add to queue.
                onlineUsers.push({
                    user: userId,
                    socket: socket.id,
                    inGame: false
                });
            }

        });

		//update the challenger's code on both screens
        socket.on('game:codeupdate', function(message) {
            io.sockets.connected[message.socket].emit('game:codeupdated', message.code);
        });

		//when a user submits correct code inform the loser and increment the winners multiplayer medal count
        socket.on('game:check', function(message){
            io.sockets.connected[message.socket].emit('game:lost');
            User.findByIdAndUpdate(message.user, {$inc: {multi: 1}},
            function (err, user) {
				console.log(user.multi);
            }
        );

        });
		
		
		// =====================================
		// SINGLEPLAYER  =======================
		// =====================================
		
		socket.on('game:single', function(challenge) {
			 io.sockets.connected[socket.id].emit('game:singleAccepted', {challenge: 0});
		});
		
		
		socket.on('game:singleCheck', function(message){
			console.log(typeof(message.res));
			console.log(message.user);
			
			//update the relevant badges in database :)
			
			if(message.res == 'gold'){
				User.findByIdAndUpdate(message.user, {$inc: {gold: 1}},
					function (err, user) {
						console.log(user.gold);
					}
				);
			}
			
			if(message.res == 'silver'){
				User.findByIdAndUpdate(message.user, {$inc: {silver: 1}},
					function (err, user) {
						console.log(user.silver);
					}
				);
			}
			
			if(message.res == 'bronze'){
				User.findByIdAndUpdate(message.user, {$inc: {bronze: 1}},
					function (err, user) {
						console.log(user.bronze);
					}
				);
			}

		});
		
		// =====================================
		// DISCONNECT  =========================
		// =====================================
		
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    });

};