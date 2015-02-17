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



/**
function to populate an array incrementally up to a specified size, n
taken from: http://www.2ality.com/2013/11/initializing-arrays.html
**/
function fillArrayWithNumbers(n) {
        var arr = Array.apply(null, Array(n));
        return arr.map(function (x, i) { return i });
 }

 
 /** 
 function to get a random number from a range, excluding a subset of numbers within that range
 modified from: http://stackoverflow.com/questions/19451425/javascript-generating-random-numbers-in-a-range-excluding-certain-numbers
 **/
function getRandomExcluding(completed){

	//create and populate an array up to the number of challenges there are
	var numbers = fillArrayWithNumbers(numChallenges);
	
	//exclude the completed challenges
	var exclude = completed;
	
	//build a filtered list of 'allowed' numbers' and then pick of one those at random
	var filtered = [];
	
	for (var i = 0; i < numbers.length; i += 1) {
		if (exclude.indexOf(numbers[i]) === -1) {
			filtered.push(numbers[i]);
		}
	}
	
	var rand = Math.floor(Math.random() * filtered.length);
	var num = filtered[rand];

	return num;

}


module.exports = function(server) {

    var io = require('socket.io').listen(server), challenger;

    // io.set("transports", ["xhr-polling"]);
    // io.set("polling duration", 10);
	
	
	// =====================================
	//  ON CONNECTION ======================
	// =====================================
    io.on('connection', function(socket) {
	
		var elo = new Elo();	
	
		// =====================================
		// MULTIPLAYER  ========================
		// =====================================

		//when a client asks for a multiplayer game
        socket.on('game:invite', function(userId) {
		
			
			
			//get the mmr for the current user
			function getUserMMR(callback){
				var mmr  = 0;
				User.findOne({_id: userId}, function (err, user) {
					if (!err) {
					  console.log(user.mmr);
					  callback(null, user.mmr);
					  return mmr;
					} else {
						callback({msg: "Something went wrong", err: err})
					};
				});
			}
			

			//for testing purposes etc
            console.log('User Connected');
			
            //If users in queue, take first user in the queue and make a pairing
            if (onlineUsers.length) {
			
				//take the first user
                challenger = onlineUsers[0];
				
				//shift the array so new pairs can be made
                onlineUsers.shift();
				
				
				console.log("challenger mmr: ", challenger.usermmr); 
				
				//logging the mmr changes if a user wins or loses (was useful in development)
				getUserMMR(function(err, res) {
						var new_usermmr = elo.newRatingIfWon(res, challenger.usermmr);
						var new_usermmrlost = elo.newRatingIfLost(res, challenger.usermmr);
						console.log("User new rating if win:", new_usermmr); 
						console.log("User new rating if lost:", new_usermmrlost);
				});			
				
					
					
				//send the socket/s and the specific (random) challenge both users will using through socket.emit
				var randChallenge = getRandomChallenge();
                io.sockets.connected[socket.id].emit('game:challengeAccepted', {socket: challenger.socket, challenge: randChallenge, mmr: challenger.usermmr});
				
				getUserMMR(function(err, res) {
					 io.sockets.connected[challenger.socket].emit('game:challengeAccepted', {socket: socket.id, challenge: randChallenge, mmr: res });	
				});
				
            } else {
				
                // if no users to challenge, add this user to queue and push necessary details to the onlineUsers array
                getUserMMR(function(err, mmr) {
					onlineUsers.push({
						user: userId,
						socket: socket.id,
						usermmr: mmr,
						inGame: false
				  });
				})
            }

        });

		//update the challenger's code on both screens 
        socket.on('game:codeupdate', function(message) {
            io.sockets.connected[message.socket].emit('game:codeupdated', message.code);
        });

		//when a user submits correct code inform the loser and increment the winners' 
		//multi player medal count and  update their elo rating
        socket.on('game:check', function(message){
			
			function getUserMMR(callback){
				var mmr  = 0;
				User.findOne({_id: message.user}, function (err, user) {
					if (!err) {
					  console.log(user.mmr);
					  callback(null, user.mmr);
					  return mmr;
					} else {
						callback({msg: "Something went wrong", err: err})
					};
				});
			}
			
			getUserMMR(function(err, res) {
				var new_usermmr = elo.newRatingIfWon(res, challenger.usermmr);
				User.findByIdAndUpdate(message.user, {$set: {mmr: new_usermmr}},
					function (err, user) {
						if (!err) {
							console.log(user.mmr);
						} else {
							// error handling
						};					
					}
				);
			});			
		
			//emit game lost to the  server to reflect to losing client
            io.sockets.connected[message.socket].emit('game:lost');
			
			//update the database for the multiplayer medal
            User.findByIdAndUpdate(message.user, {$inc: {multi: 1}},
				function (err, user) {
					if (!err) {
						console.log(user.multi);
					} else {
						// error handling
					};					
				}
			);
			
			//update the database for the 'complete' medal
			User.findByIdAndUpdate(message.user, {$inc: {complete: 1}},
				function (err, user) {
					if (!err) {
						console.log(user.complete);
					} else {
						// error handling
					};					
				}
			);
        });
		
		
		//if we recieve an eloupdate message (on a loss) we calculate our new elo and update it as required
		socket.on('game:eloupdate', function(message){
			
			function getUserMMR(callback){
				var mmr  = 0;
				User.findOne({_id: message.user}, function (err, user) {
					if (!err) {
					  console.log(user.mmr);
					  callback(null, user.mmr);
					  return mmr;
					} else {
						callback({msg: "Something went wrong", err: err})
					};
				});
			}
			
			getUserMMR(function(err, res) {
				var new_usermmr = elo.newRatingIfLost(res, challenger.usermmr);
				User.findByIdAndUpdate(message.user, {$set: {mmr: new_usermmr}},
					function (err, user) {
						if (!err) {
							console.log(user.mmr);
						} else {
							// error handling
						};					
					}
				);
			});	

			
		});
		
		// =====================================
		// SINGLEPLAYER  =======================
		// =====================================
		
		//when a client requests a singleplayer game
		socket.on('game:single', function(challenge) {
		
		
			function getUserCompleted(callback){
					var completed  = [];
					
					User.findOne({_id: challenge.user}, function (err, user) {
						if (!err) {
						  console.log(user.completed);
						  callback(null, user.completed);
						  return completed;
						} else {
							callback({msg: "Something went wrong", err: err})
						};
					});
			}
				
			
			getUserCompleted(function(err, completed) {
				var randChallenge = getRandomExcluding(completed);
				console.log('random challenge picked = ' + randChallenge);
				
				if (randChallenge === undefined || randChallenge === null){
					io.sockets.connected[socket.id].emit('game:noneAvailable');		
				}
				else{
					io.sockets.connected[socket.id].emit('game:singleAccepted', {challenge: randChallenge});
				}
			})
		
			//get a random challenge
			var randChallenge = getRandomChallenge();
			
			//send them back the random challenge
			//io.sockets.connected[socket.id].emit('game:singleAccepted', {challenge: randChallenge});
		});
		
		//when a client successfully submits a correct answer
		socket.on('game:singleCheck', function(message){
		
			//for testing
			console.log(typeof(message.res));
			console.log(message.user);
			
			
			User.findByIdAndUpdate(message.user, {$push: {completed: message.challengeID}},
					function (err, user) {
						if (!err) {
							console.log(user.completed);
						} else {
							// error handling
						};					
					}
			);
			
			
			//START: update the relevant badges in database :)
			
			if(message.res == 'gold'){
				User.findByIdAndUpdate(message.user, {$inc: {gold: 1}},
					function (err, user) {
						if (!err) {
							console.log(user.gold);
						} else {
							// error handling
						};					
					}
				);
			}
			
			if(message.res == 'silver'){
				User.findByIdAndUpdate(message.user, {$inc: {silver: 1}},
					function (err, user) {
						if (!err) {
							console.log(user.silver);
						} else {
							// error handling
						};					
					}
				);
			}
			
			if(message.res == 'bronze'){
				User.findByIdAndUpdate(message.user, {$inc: {bronze: 1}},
					function (err, user) {
						if (!err) {
							console.log(user.bronze);
						} else {
							// error handling
						};					
					}
				);
			}
			
			User.findByIdAndUpdate(message.user, {$inc: {complete: 1}},
				function (err, user) {
					if (!err) {
						console.log(user.complete);
					} else {
						// error handling
					};					
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