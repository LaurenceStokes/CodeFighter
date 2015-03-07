'use strict';

//setup variables
var io = require('socket.io'),
    User = require('../app/models/user'),
    onlineUsers = [],
	ingameUsers = [],
	searchingUsers = [],
	
	//define the number of challenges
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


/** 
 function merge two arrays and de-duplicate items
 taken from: http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
 **/
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
	
	//usage
	//var array3 = arrayUnique(array1.concat(array2));

};




// =====================================
// SOCKET STUFF ========================
// =====================================
module.exports = function(server) {

    var io = require('socket.io').listen(server), challenger;

    // io.set("transports", ["xhr-polling"]);
    // io.set("polling duration", 10);
	
	
	// =====================================
	//  ON CONNECTION ======================
	// =====================================
    io.on('connection', function(socket) {
		
	
		var elo = new Elo();	
		
		var num = 0;
		var counter;
		var challenger;
		var uid;
		var challengerSocket;
		var challengermmr;
		var ingame = false;
		var searching = false;
		var inArray = false;
		
		function stop_count() {
			clearInterval(counter);
			num = 0;
		}
	
		// =====================================
		// MULTIPLAYER  ========================
		// =====================================
		

		//when a client asks for a multiplayer game
        socket.on('game:invite', function(userId) {
		
			searchingUsers.push(1);
			searching = true;
			io.sockets.connected[socket.id].emit('game:onlineUsers',  {onlineusers: io.engine.clientsCount, ingameusers: ingameUsers.length, searchingusers: searchingUsers.length});
			
			uid = userId;
			
			function getUserCompleted(callback){
					var completed  = [];
					
					User.findOne({_id: userId}, function (err, user) {
						if (!err) {
						  console.log(user.completed);
						  callback(null, user.completed);
						  return completed;
						} else {
							callback({msg: "Something went wrong", err: err})
						};
					});
			}
			
			/**
			getUserCompleted(function(err, completed) {
				var randChallenge = getRandomExcluding(completed);
				if (randChallenge === undefined || randChallenge === null){
					console.log('hit me');
					io.sockets.connected[socket.id].emit('game:noneAvailable');	
				}
			});**/
			
			//get the mmr for the current user
			function getUserMMR(callback){
				var mmr  = 0;
				User.findOne({_id: userId}, function (err, user) {
					if (!err) {
					  //console.log(user.mmr); (Was for testing)
					  callback(null, user.mmr);
					  return mmr;
					} else {
						callback({msg: "Something went wrong", err: err})
					};
				});
			}
			
			//function to get the closest item from an array
			//modified from: http://stackoverflow.com/questions/8584902/get-closet-number-out-of-array
			function closest (num, arr) {
                var curr = arr[0];
                var diff = Math.abs (num - curr);
                for (var val = 0; val < arr.length; val++) {
                    var newdiff = Math.abs (num - arr[val]);
                    if (newdiff < diff) {
                        diff = newdiff;
                        curr = arr[val];
                    }
                }
                return (val-1);
            }
			
			//for testing purposes etc
            console.log('User Connected');
			

			
			function start_interval(number) {
				
					num = number;
		
					counter = setInterval(function () {getUserMMR(function(err, res) {	
					
					io.sockets.connected[socket.id].emit('game:onlineUsers',  {onlineusers: io.engine.clientsCount, ingameusers: ingameUsers.length, searchingusers: searchingUsers.length});
					
					num++;
					
					getUserCompleted(function(err, completed) {
						var randChallenge = getRandomExcluding(completed);
						if (randChallenge === undefined || randChallenge === null){
							console.log('hit me 1');
							io.sockets.connected[socket.id].emit('game:noneAvailable');
							stop_count();
						}
					});
					
					//get the closest ranked player from the existing onlineusers array
					var indice = closest(res, onlineUsers);
					console.log(indice);
					console.log(num);
					console.log(inArray);
					challenger = onlineUsers[indice];
					//console.log('testing for acquiring challenger completed '+ challenger.usercomplete);
				
					//if there is no 'closest' player assume array is now empty
					//and go straight to putting ourselves in array
					if(indice < 0){
						
						num = 40;
						
					}
					
					if(num < 10){
						if((res <= challenger.usermmr + 20)  && res >= (challenger.usermmr -20)){

							//send the socket/s and the specific (random) challenge both users will using through socket.emit
							getUserCompleted(function(err, completed) {
								var array3 = arrayUnique((challenger.usercomplete).concat(completed));
								var randChallenge = getRandomExcluding(array3);
								if (randChallenge === undefined || randChallenge === null){
									console.log('hit this one!');
								}else{
									if ((socket.id !== undefined || socket.id !== null) && (challenger.socket !== undefined || challenger.socket !== null)){
										//splice array to remove the matched challenger
										onlineUsers.splice(indice, 1); 
										stop_count();
										io.sockets.connected[socket.id].emit('game:challengeAccepted', {socket: challenger.socket, challenge: randChallenge, mmr: challenger.usermmr});
										io.sockets.connected[challenger.socket].emit('game:challengeAccepted', {socket: socket.id, challenge: randChallenge, mmr: res });
									}
								}
							});							
						}
					}else if(num < 20){
						if((res <= challenger.usermmr + 50)  && res >= (challenger.usermmr -50)){ 
							
							//send the socket/s and the specific (random) challenge both users will using through socket.emit
							getUserCompleted(function(err, completed) {
								var array3 = arrayUnique((challenger.usercomplete).concat(completed));
								var randChallenge = getRandomExcluding(array3);
								if (randChallenge === undefined || randChallenge === null){
									console.log('hit this one!');
								}else{
									if ((socket.id !== undefined || socket.id !== null) && (challenger.socket !== undefined || challenger.socket !== null)){
										//splice array to remove the matched challenger
										onlineUsers.splice(indice, 1); 
										stop_count();
										io.sockets.connected[socket.id].emit('game:challengeAccepted', {socket: challenger.socket, challenge: randChallenge, mmr: challenger.usermmr});
										io.sockets.connected[challenger.socket].emit('game:challengeAccepted', {socket: socket.id, challenge: randChallenge, mmr: res });
									}
								}
							});		
							
						}
					}
					else if(num < 40){
						if((res <= challenger.usermmr + 100)  && res >= (challenger.usermmr -100)){
							
							//send the socket/s and the specific (random) challenge both users will using through socket.emit
							getUserCompleted(function(err, completed) {
								var array3 = arrayUnique((challenger.usercomplete).concat(completed));
								var randChallenge = getRandomExcluding(array3);
								if (randChallenge === undefined || randChallenge === null){
									console.log('hit this one!');
								}else{
									if ((socket.id !== undefined || socket.id !== null) && (challenger.socket!== undefined || challenger.socket !== null)){
										//splice array to remove the matched challenger
										onlineUsers.splice(indice, 1); 
										stop_count();
										io.sockets.connected[socket.id].emit('game:challengeAccepted', {socket: challenger.socket, challenge: randChallenge, mmr: challenger.usermmr});
										io.sockets.connected[challenger.socket].emit('game:challengeAccepted', {socket: socket.id, challenge: randChallenge, mmr: res, challenger: true});
									}
								}
							});		
							
						}
					}

					//if we're waiting for over 40 seconds, just stick us in the array
					else if (num >= 40 && num < 80){
						if(!inArray){
							getUserCompleted(function(err, completed) {
									onlineUsers.push({
									user: userId,
									socket: socket.id,
									usermmr: res,
									usercomplete: completed,
									inGame: false
									});
								});
							inArray = true;
						}
					}
					//if we're waiting for too long, disconnect us
					else if (num >=80){
						io.sockets.connected[socket.id].emit('game:timeOut');
						stop_count();
					}
				
				})},1000)        
			}
					
			
            //If users in queue, start the interval function to loop round to find the
			//closed rated player and matchmake
            if (onlineUsers.length) {
				
				
				start_interval(0);
			
			//otherwise start at the point where we just go 'into' array 
			//as the array is empty and searching is useless
            } else {
				
				
                start_interval(40);
            }

        });
		
		//when we recieve a message that we've been matched
        socket.on('game:ingame', function(data) {
			ingame = true;
			searching = false;
			ingameUsers.push(1);
			searchingUsers.splice(-1,1);
            stop_count();
			challengerSocket = data.socket;
			challengermmr = data.mmr;
			socket.emit('game:startGame', {socket: data.socket, challenge: data.challenge, mmr: data.mmr});
        });
		
		//when a client clicks cancel search
		socket.on('game:cancel', function(){
			socket.disconnect()
		});		

		//update the challenger's code on both screens 
        socket.on('game:codeupdate', function(message) {
		
			//check if the challenger is still connected
			try{			
				io.sockets.connected[message.socket].emit('game:codeupdated', message.code);				
			}catch(e){
				console.log('error');
			}
			
        });

		//when a user submits correct code inform the loser and increment the winners' 
		//multi player medal count and  update their elo rating
        socket.on('game:check', function(message){
		
			//so we don't get a loss
			ingame = false;
			
			//remove us from in game array
			ingameUsers.splice(-1,1);
			
			//emit game lost to the  server to reflect to losing client
			
			//check if the challenger is still connected
			try{
				io.sockets.connected[message.socket].emit('game:lost');
			}catch(e){
				console.log('error');
			}
			
			//update that they have completed this challenge
			User.findByIdAndUpdate(message.user, {$push: {completed: message.challengeID}},
					function (err, user) {
						if (!err) {
							console.log(user.completed);
						} else {
							// error handling
						};					
					}
			);
			
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
					ingame = true;
					ingameUsers.push(1);
					io.sockets.connected[socket.id].emit('game:singleAccepted', {challenge: randChallenge});
				}
			})
		
			//get a random challenge
			//var randChallenge = getRandomChallenge();
			
			//send them back the random challenge
			//io.sockets.connected[socket.id].emit('game:singleAccepted', {challenge: randChallenge});
		});
		
		//when a client successfully submits a correct answer
		socket.on('game:singleCheck', function(message){
		
			//for testing
			console.log(typeof(message.res));
			console.log(message.user);
			
			//update that they have completed this challenge
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
		
		//get array position for the socket in the online users
		function arrayPosition(socketid) {
			var i = null;
			for (i = 0; onlineUsers.length > i; i += 1) {
				if (onlineUsers[i].socket === socket.id) {
					return i;
				}
			}
     
		return -1;
		};
		
		// =====================================
		// DISCONNECT  =========================
		// =====================================
		
        socket.on('disconnect', function() {
		
			stop_count();
			
			function getUserMMR(callback){
					var mmr  = 0;
					User.findOne({_id: uid}, function (err, user) {
						if (!err) {
						  console.log(user.mmr);
						  callback(null, user.mmr);
						  return mmr;
						} else {
							callback({msg: "Something went wrong", err: err})
						};
					});
				}
				
			if (searching){
				searchingUsers.splice(-1,1);
			}
			
			if(ingame){
				//defensive try/catch
				ingameUsers.splice(-1,1);
				
				try{			
					io.sockets.connected[challengerSocket].emit('game:challengerLeft');	
					getUserMMR(function(err, res) {
						var new_usermmr = elo.newRatingIfLost(res, challengermmr);
						User.findByIdAndUpdate(uid, {$set: {mmr: new_usermmr}},
							function (err, user) {
								if (!err) {
									console.log(user.mmr);
								} else {
									// error handling
								};					
							}
						);
					});	
					
				}catch(e){
					console.log('error hit');
				}
			}
	
			
			//splice array, removing socket that disconnected
			var pos = arrayPosition(socket.id);
			if (pos != - 1){
				onlineUsers.splice(pos, 1);
			}
			console.log('user disconnected');
        });
    });

};