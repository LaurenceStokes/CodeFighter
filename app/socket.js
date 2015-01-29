'use strict';

//setup variables
var io = require('socket.io'),
    User = require('../app/models/user'),
    onlineUsers = [],
	numChallenges = 3;

//for the ELO system, using node arpad module	
var Elo = require('arpad');


/**
function to get a random challenge
**/
function getRandomChallenge(){
	return Math.floor(Math.random()* numChallenges);
}


module.exports = function(server) {

    var io = require('socket.io').listen(server), challenger;

    // io.set("transports", ["xhr-polling"]);
    // io.set("polling duration", 10);
	
	
	// =====================================
	//  ON CONNECTION ======================
	// =====================================
    io.on('connection', function(socket) {
	
	
		// =====================================
		// MULTIPLAYER  ========================
		// =====================================

		//when a client asks for a multiplayer game
        socket.on('game:invite', function(userId) {
		
		
			var elo = new Elo();			
			
			function getUserMMR(){
				
				var mmr = 0;
				
				User.findOne({_id: userId}, function (err, user) { 
					console.log(user.multi);
					mmr = user.multi;
					return mmr;
				});
				
				return mmr;
				
			}
			
			console.log('test ' + getUserMMR());

			//for testing purposes etc
            console.log('User Connected');
			
            //If users in queue, take first user in the queue and make a pairing
            if (onlineUsers.length) {
			
				//take the first user
                challenger = onlineUsers[0];
				
				//shift the array so new pairs can be made
                onlineUsers.shift();
				
				//send the socket/s and the specific (random) challenge both users will using through socket.emit
				var randChallenge = getRandomChallenge();
                io.sockets.connected[socket.id].emit('game:challengeAccepted', {socket: challenger.socket, challenge: randChallenge});
                io.sockets.connected[challenger.socket].emit('game:challengeAccepted', {socket: socket.id, challenge: randChallenge});
            } else {
                // if no users to challenge, add this user to queue
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

		//when a user submits correct code inform the loser and increment the winners multi player medal count
        socket.on('game:check', function(message){
		
			//emit game lost to the  server to reflect to losing client
            io.sockets.connected[message.socket].emit('game:lost');
			
			//update the database for the multiplayer medal
            User.findByIdAndUpdate(message.user, {$inc: {multi: 1}},
				function (err, user) {
					console.log(user.multi);
				}
			);
			
			//update the database for the 'complete' medal
			User.findByIdAndUpdate(message.user, {$inc: {complete: 1}},
				function (err, user) {
					console.log(user.complete);
				}
			);

        });
		
		
		// =====================================
		// SINGLEPLAYER  =======================
		// =====================================
		
		//when a client requests a singleplayer game
		socket.on('game:single', function(challenge) {
		
			//get a random challenge
			var randChallenge = getRandomChallenge();
			
			//send them back the random challenge
			io.sockets.connected[socket.id].emit('game:singleAccepted', {challenge: randChallenge});
		});
		
		//when a client successfully submits a correct answer
		socket.on('game:singleCheck', function(message){
			console.log(typeof(message.res));
			console.log(message.user);
			
			
			//START: update the relevant badges in database :)
			
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
			
			User.findByIdAndUpdate(message.user, {$inc: {complete: 1}},
				function (err, user) {
					console.log(user.complete);
				}
			);
			
			//END: badge updating

		});
		
		// =====================================
		// DISCONNECT  =========================
		// =====================================
		
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    });

};