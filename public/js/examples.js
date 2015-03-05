/* ========================================================================
 * CodeFighter Examples Javascript Code
 * ========================================================================
 * Copyright 2014 Laurence Stokes
 * ======================================================================== */

 
// =====================================
//  ACE Editor Stuff ===================
// =====================================


/**
function to set the editor style and theme
**/
function setEditor(editorname) {
    var editorname = ace.edit(editorname);
    editorname.setTheme("ace/theme/kuroir");
    editorname.getSession().setMode("ace/mode/javascript");
}


//set the editors 
//setEditor("editor");
//setEditor("editortwo");
//setEditor("editorthree");


//set the editors (hard coded for the minute)

if (document.getElementById("editor")) {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/kuroir");
    editor.getSession().setMode("ace/mode/javascript");
}


if (document.getElementById("editortwo")) {
    var editortwo = ace.edit("editortwo");
    editortwo.setTheme("ace/theme/kuroir");
    editortwo.getSession().setMode("ace/mode/javascript");
}

if (document.getElementById("editorthree")) {
    var editorthree = ace.edit("editorthree");
    editorthree.setTheme("ace/theme/kuroir");
    editorthree.getSession().setMode("ace/mode/javascript");
}

if (document.getElementById("challenger")) {
    var challenger = ace.edit("challenger");
    challenger.setTheme("ace/theme/kuroir");
    challenger.getSession().setMode("ace/mode/javascript");
    challenger.setReadOnly(true);
}


/**function to return focus to editor (doesn't work :<)
 **/
function returnToEditor(editorname) {
    /**var currline = editorname.getSelectionRange().start.row;
    console.log(currline);
    editorname.gotoLine(currline+1); //Go to current line + 1 (the actual current line)
    editorname.navigateLineEnd() // go the end of that line
    editorname.focus(); //To focus the ace editor
    editorname.setReadOnly(false);**/
    editorname.focus();
}


// =====================================
//  Favicon ============================
// =====================================


var IE = navigator.userAgent.indexOf("MSIE")!=-1

var favicon = {
    change: function(iconURL) {
        if (arguments.length == 2) {
            document.title = optionalDocTitle}
        this.addLink(iconURL, "icon")
        this.addLink(iconURL, "shortcut icon")

        // Google Chrome HACK - whenever an IFrame changes location 
        // (even to about:blank), it updates the favicon for some reason
        // It doesn't work on Safari at all though :-(
        if (!IE) { // Disable the IE "click" sound
            if (!window.__IFrame) {
                __IFrame = document.createElement('iframe')
                var s = __IFrame.style
                s.height = s.width = s.left = s.top = s.border = 0
                s.position = 'absolute'
                s.visibility = 'hidden'
                document.body.appendChild(__IFrame)}
            __IFrame.src = 'about:blank'}},

    addLink: function(iconURL, relValue) {
        var link = document.createElement("link")
        link.type = "image/x-icon"
        link.rel = relValue
        link.href = iconURL
        this.removeLinkIfExists(relValue)
        this.docHead.appendChild(link)},

    removeLinkIfExists: function(relValue) {
        var links = this.docHead.getElementsByTagName("link");
        for (var i=0; i<links.length; i++) {
            var link = links[i]
            if (link.type == "image/x-icon" && link.rel == relValue) {
                this.docHead.removeChild(link)
                return}}}, // Assuming only one match at most.
				 
	docHead: document.getElementsByTagName("head")[0]}
	
	

// =====================================
//  HTML modifications =================
// =====================================

/**
function to set the Colour of the specified element 
(for correct/incorrect answers)
**/
function setColour(elementID, colour) {
    document.getElementById(elementID).style.color = colour;
}

/**
function to set the InnerHTML of the specified element 
**/
function setInnerHTML(elementID, text) {
    document.getElementById(elementID).innerHTML = text;
}


// =====================================
//  Stopwatch Function =================
// =====================================

//global second and millisecond variables for the set-interval timers
var sec = 0;
ms = 0;


/**function to start a stopwatch 
 **/
function startClock(elementID, bronze) {

    //if there is a running clock & progress bar stop them before starting a new instance!!
    if (typeof clock != "undefined" && typeof progress != "undefined") {
        stopClock();
        stopProgressBar();
    }
    clock = setInterval("stopWatch()", 1000);
	
    if (elementID && bronze) {
        progress = setInterval(function() {
            updateProgressBarSingle(elementID, bronze)
        }, 100);
    }
	
	if (elementID && bronze == null) {
        progress = setInterval(function() {
            updateProgressBar(elementID)
        }, 100);
    }
}

function stopWatch() {
    sec++;
}


function stopClock() {
    window.clearInterval(clock);
    sec = 0;
}


function startTime() {
    startClock();
    clocktimer = setInterval(function() {
        updateTimer()
    }, 1000);
}

function updateTimer() {
    setInnerHTML('mp-timer', 'Elapsed Time: ' + x(sec));
}


// =====================================
//  Beautifies time output =============
// =====================================

/**
http://codegolf.stackexchange.com/questions/12525/javascript-smallest-code-to-convert-seconds-to-time
-converts seconds into the format 0 hours, 0 mins 0 secs, taken from above link. (slightly modified)
**/
function x(T, Z, M) {
    h = T / 3600;
    m = h % 1 * 60;
    s = m % 1 * 60;
    r = ~~h + 'Hours ' + ~~m + 'Min ' + ~~s + 'Sec'
    Z ? r = r.replace(/0\w+/g, '') : 0
    M ? r = r.replace(/\d+sec/, '') : 0
    return r
}


// =====================================
//  Progress Bars ======================
// =====================================

function stopProgressBar() {
    window.clearInterval(progress);
    ms = 0;
}

/**
function to dynamically update the progress bar depending on how long the challenge should take with a switch to account for which challenge
**/

function updateProgressBar(elementID) {
    ms++ // (1/10th of a second)
    switch (elementID) {
        case ('progress1'):
            //bronze limit is 45 seconds, so 450ms
            setInnerHTML(elementID, '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + (ms / 4.5) + '%;"> </div>');
            break;
        case ('progress2'):
            setInnerHTML(elementID, '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + (ms / 10) + '%;"> </div>');
            break;
        case ('progress3'):
            setInnerHTML(elementID, '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + (ms / 360) + '%;"> </div>');
            break;
        default:
            setInnerHTML(elementID, '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + (ms / 5) + '%;"> </div>');
    }
}

/**
function to dynamically update the (singleplayer) progress bar depending on how long the challenge should take with a switch to account for which challenge
**/

function updateProgressBarSingle(elementID, bronze) {
    ms++ // (1/10th of a second)
	
    //bronze limit is 45 seconds, so 450ms
    setInnerHTML(elementID, '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + (ms / (bronze/10)) + '%;"> </div>');
	
}


// ======================================
//  Calculations (for the INDEX/EXAMPLES)
//  I have left these as is due to ad hoc agile development.
//  These were basically my initial prototypes - albeit very
//  similar to deployed code.
// ======================================

/**
function to calculate whether the specific challenge was correct or not
and display appropriate error messages (syntax/reference errors, etc)
**/
function calculateOne() {

    //get two number betweens 1 and 100 to test
    rand1 = Math.floor((Math.random() * 100) + 1);
    rand2 = Math.floor((Math.random() * 100) + 1);


    //calculate the input, passing the relevant ACE editor object as an object, the test condition as a string, and the two strings referring 
    //to the modal text and title html IDs respectively
    calculate(editor, 'test(rand1,rand2) == rand1 * rand2;', 'ModalText', 'ModalTitle', 15, 30, 45);
}


/**
function to calculate whether the specific challenge was correct or not
and display appropriate error messages (syntax/reference errors, etc)
**/
function calculateTwo() {

    //get two number between 1 and 100 to test
    rand1 = Math.floor((Math.random() * 100) + 1);
    rand2 = Math.floor((Math.random() * 100) + 1);

    calculate(editortwo, 'test(rand1,rand2) == Math.pow(rand1, rand2)', 'ModalText', 'ModalTitle', 30, 60, 120);

}

/**
function to calculate whether the specific challenge was correct or not
and display appropriate error messages (syntax/reference errors, etc)
**/
function calculateThree() {

    calculate(editorthree, 'test(250) == Number(182109)', 'ModalText', 'ModalTitle', 600, 2000, 3600);

}



/**
function to calculate whether a challenge was correct or not
and display appropriate error (syntax/reference errors, etc)
and success messages as well as the specific time conditions to
award gold silver and bronze.
**/
function calculate(editorname, testcond, modalid, modaltitleid, gold, silver, bronze) {
	
	setInnerHTML("ModalTitle", "Processing your code...");
	setInnerHTML("ModalText", '<img class="img-responsive img-rounded center-block" src="img/loadingsmall.gif">');
	
	var workerResponse = '';
	var worker = new Worker("js/worker.js");
 
	worker.addEventListener('message', function(e) {
    workerResponse = e.data;
	}, false);
 
	worker.postMessage(({'cmd': 'start', 'msg': editorname.getValue()}));
	//console.log(workerResponse);
	
	var myVar;

		myVar = setTimeout(timeout, 3000);

	function timeout(){
	if(workerResponse == 'done'){

    //can't submit correct answer without having first clicked start. :> (for examples only)
    if (typeof clock != "undefined" && typeof progress != "undefined") {
	

        try {
            if (eval(editorname.getValue() + testcond)) {
                if (sec < gold) {
                    setInnerHTML(modalid, 'Congratulations!<br> You completed the challenge in: ' + x(sec) + '<br><br>You have been awarded: <br><br> <img class="center-block" src="img/gold.png"></img>');
                } else if (sec < silver) {
                    setInnerHTML(modalid, 'Congratulations!<br> You completed the challenge in: ' + x(sec) + '<br><br>You have been awarded: <br><br> <img class="center-block" src="img/silver.png"></img>');
                } else if (sec < bronze) {
                    setInnerHTML(modalid, 'Congratulations!<br> You completed the challenge in: ' + x(sec) + '<br><br>You have been awarded: <br><br> <img class="center-block" src="img/bronze.png"></img>');
                } else {
                    setInnerHTML(modalid, 'Congratulations!<br> You completed the challenge in: ' + x(sec));
                }
                stopProgressBar();
                stopClock();
                setInnerHTML(modaltitleid, 'Correct!');
                setColour(modaltitleid, "green");
            } else {
                setInnerHTML(modaltitleid, "Incorrect");
                setColour(modaltitleid, "red");
                setInnerHTML(modalid, "Hey, it didn't work this time - have another go and try again!");
            }
        } catch (e) {
            setInnerHTML(modaltitleid, 'Incorrect');
            setColour(modaltitleid, "red");
            if (e instanceof SyntaxError) {
                setInnerHTML(modalid, 'It looks like you have an error!<br>' + e);
            } else if (e instanceof ReferenceError) {
                setInnerHTML(modalid, e + '<br>Please ensure your function and variables are correctly named!');
            } else {
                setInnerHTML(modalid, 'It looks like you have an error!<br>' + e);
            }

        }

    } else {
        setInnerHTML(modalid, 'Please click start first');
    }
	}else{
		setInnerHTML(modaltitleid, "Checking Code");
		setInnerHTML(modalid, "Looks like you have an infite loop, please check your code!");
		worker.terminate();
	}
	}

}



// ========================================================
// Client-Side Checks for challenges (not the example ones)  
// ========================================================

/**
function/s for the challenge calculation for the multiplayer gamemode
**/
function calculateMulti(){
    var finalCode = editor.getValue();
    var correct = challengeDetail.calculate(finalCode);
    showResult(correct);
}


function showResult(isCorrect) {
    if(isCorrect == 'incorrect'){
        setInnerHTML("ModalTitle", "Incorrect");
        setColour("ModalTitle", "red");
        setInnerHTML('ModalText', 'Sorry, that answer was incorrect');
        return true;
    }
    else if(isCorrect == 'correct') {
        setInnerHTML('ModalTitle', 'Correct!');
        setColour('ModalTitle', "green");
        setInnerHTML('ModalText', 'Congratultions! You have solved the challenge');
    } else {
        setInnerHTML("ModalTitle", "Incorrect");
        setColour("ModalTitle", "red");
        setInnerHTML('ModalText', 'You have an error ' + isCorrect);
    }
};

/**
function for the challenge calculation for the singleplayer gamemode
**/
function showResultSingle(isCorrect, gold, silver, bronze){

	var result = '';
	
    try {
            if (isCorrect == 'correct') {
                if (sec < gold) {
                    setInnerHTML('ModalText', 'Congratulations!<br> You completed the challenge in: ' + x(sec) + '<br><br>You have been awarded: <br><br> <img class="center-block" src="img/gold.png"></img>');
					result = 'gold';
                } else if (sec < silver) {
                    setInnerHTML('ModalText', 'Congratulations!<br> You completed the challenge in: ' + x(sec) + '<br><br>You have been awarded: <br><br> <img class="center-block" src="img/silver.png"></img>');
					result = 'silver';
                } else if (sec < bronze) {
                    setInnerHTML('ModalText', 'Congratulations!<br> You completed the challenge in: ' + x(sec) + '<br><br>You have been awarded: <br><br> <img class="center-block" src="img/bronze.png"></img>');
					result = 'bronze';
                } else {
                    setInnerHTML('ModalText', 'Congratulations!<br> You completed the challenge in: ' + x(sec));
                }
                stopProgressBar();
                stopClock();
                setInnerHTML('ModalTitle', 'Correct!');
				setColour('ModalTitle', "green");
            } else if(isCorrect == 'incorrect') {
                setInnerHTML("ModalTitle", "Incorrect");
				setColour("ModalTitle", "red");
				setInnerHTML('ModalText', 'Sorry, that answer was incorrect');
            } else{
				setInnerHTML("ModalTitle", "Incorrect");
				setColour("ModalTitle", "red");
				setInnerHTML('ModalText', 'It looks like you have an error!<br>' + isCorrect);
				
			}
        } catch (e) {
            setInnerHTML("ModalTitle", 'Incorrect');
            setColour("ModalTitle", "red");
            if (e instanceof SyntaxError) {
                setInnerHTML('ModalText', 'It looks like you have an error!<br>' + e);
            } else if (e instanceof ReferenceError) {
                setInnerHTML('ModalText', e + '<br>Please ensure your function and variables are correctly named!');
            } else {
                setInnerHTML('ModalText', 'It looks like you have an error!<br>' + e);
            }

        }
		return result;
};


	

// =====================================
// SOCKET.IO STUFF  ====================
// =====================================

//needed this to be global scope
var challengeDetail;

$(document).ready(function() {
	

	// =====================================
    // MULTIPLAYER  ========================
    // =====================================
    if (document.title === 'Multiplayer Challenge') {
		
			
		var challengerLeft = false;

        var socket = io(), challengerSocket;

		//testing purposes
        console.log(window.userId);

        // Submit message to server asking for challenger.
        socket.emit('game:invite', window.userId);
		
		//if we cancel an active search
        $('.cancel-search').click(function(e) {
			window.onbeforeunload = null;
			window.onunload=null;
			socket.emit('game:cancel');
			setTimeout(function(){ 
				$('.finding-challenger').hide();
				$('.cancel').show();
			},1000);
			//redirect to profile page
			window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
		
        });
		
		
		//Inform user there are no available challenges
		socket.on('game:noneAvailable', function(data) {
		console.log('test');
			setTimeout(function(){ 
				$('.finding-challenger').hide();
				$('.none-available').show();
			},1000);
			//redirect to profile page
			window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
        });
		
		socket.on('game:challengerLeft', function() {
			window.onbeforeunload = null;
			window.onunload=null;
			console.log('game:challengerLeft');
			challengerLeft = true;
			$(".forfeit-clicked" ).trigger( "click" );
			setInnerHTML("ModalTitle", "Your Challenger has Forfeited!");
			setInnerHTML("ModalText", 'You may carry on to complete the challenge');			
        });
		
		
		//Inform user they timed out/searched for too long
		socket.on('game:timeOut', function(data) {
			setTimeout(function(){ 
				$('.finding-challenger').hide();
				$('.time-out').show();
			},1000);
			//redirect to profile page
			window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
        });

		
		//when the server emits a challengeAccepted take
		//the challenge description and update html on page
        socket.on('game:challengeAccepted', function(data) {
		
			window.onbeforeunload = function (e) {
				var message = "If you leave now it will be considered a forfeit and count as a loss!";
				return message;
			}
		
			window.onunload = function(){
				$("#forfeit" ).trigger( "click" );
			}
			
		
			socket.emit('game:ingame');
            challengeDetail = challenges[data.challenge];
            $('.challenge-description').text(challengeDetail.description);
            $('.finding-challenger').hide();
			$('.challenge-found').show();
			
			//change the favicon so if users were on a different tab they know a match has been found
			//$("#favicon").attr("href","favicon2.ico");
			
			//set up a timer to countdown to the match starting
			var count=6;
			var counter=setInterval(timer, 1000); //run timer every second

			//timer function to countdown to the match starting
			function timer(){
				count=count-1;				
					
				if (count <= 0){
					clearInterval(counter);
					Tinycon.setBubble(0);
					
					//timeout to switch the favicon to the 'in game' favicon (chrome bug fix: https://code.google.com/p/chromium/issues/detail?id=99549)
					window.setTimeout( function(event) { favicon.change("img/favicon2.ico"); }, 110);
					
					$('.challenge-found').hide();
					$('.challenge').show();	
					return;
			  }
			  
				//update the favicon to have a countdown based on the current count
				Tinycon.setBubble(count);
				
				if (count >=2){
					setInnerHTML('timer', "<span id='countdown'>"+count+"</span>"+ " Seconds...");
					//animate the countdown
					$("#countdown").delay(200).animate({"opacity": "1"}, 300);
				}
				else{
					setInnerHTML('timer', "<span id='countdown'>"+count+"</span>"+ " Second...");
					//animate countdown
					$("#countdown").delay(200).animate({"opacity": "1"}, 300);
				}
			}
					
			timer();
			
			//get the socket for the opponent
            challengerSocket = data.socket;
        });
		
		
		//if we cancel a game
        $('#forfeit').click(function(e) {
			window.onbeforeunload=null;
			window.onunload=null;
			console.log(challengerSocket);
			if(!challengerLeft){
				socket.emit('game:forfeit', {user: window.userId, socket: challengerSocket}); 
				$(".forfeit-clicked" ).trigger( "click" );
				setInnerHTML("ModalTitle", "You Have Forfeited");
				setInnerHTML("ModalText", 'You will be redirected in a few moments');
				}
			//redirect to profile page
			window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
		
        });

		//when we update our editor pass this to the server to reflect changes
		//on the challenger's page
        editor.getSession().on('change', function() {

            var message = {
                socket: challengerSocket,
                code: editor.getValue().toString() //get the value of the editor to pass to server
            };

			//socket.emit to send to server
            socket.emit('game:codeupdate', message);
        });

		//when we receive the changes from our opponent's editor
        socket.on('game:codeupdated', function(message) {
            console.log(typeof(message));
            challenger.setValue(message);
        });
		
		//so user can't submit correct answer over and over
		var clicked = true
		
		//so we know if the opponent has solved the answer already
		var solved = false;

		//when we submit an answer
        $('.submit-code').click(function(e) {
		
			if(clicked){
			
				var finalCode = editor.getValue();
				
				
				setInnerHTML("ModalTitle", "Processing your code...");
				setInnerHTML("ModalText", '<img class="img-responsive img-rounded center-block" src="img/loadingsmall.gif">');
	
				var workerResponse = '';
				var worker = new Worker("js/worker.js");
 
				worker.addEventListener('message', function(e) {
					workerResponse = e.data;
				}, false);
 
				worker.postMessage(({'cmd': 'start', 'msg': finalCode}));
				//console.log(workerResponse);
	
				var myVar;

				myVar = setTimeout(timeout, 3000);

				function timeout(){
					if(workerResponse == 'done'){
				
						//calculate if the answer is correct
						var correct = challengeDetail.calculate(finalCode);												
						
						//if the answer is correct emit a successful game check to server
						if(correct == 'correct'){
						
							//if we haven't received a gamelost from the server
							if(!solved){
							
								//display the result (correct/incorrect) to the user
								showResult(correct);
						
								//emit a gamecheck to the server so the server can inform the challenger they have lost
								socket.emit('game:check', {socket:challengerSocket, user: window.userId, challengeID: challengeDetail.challengeId});
							}
							
							//prevent user from re-clicking submit
							clicked = false;
							
							//redirect to profile page
							window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
						}else{
							//display the result (correct/incorrect) to the user
							showResult(correct);
						
						}
					}else{
						setInnerHTML("ModalTitle", "Checking Code");
						setInnerHTML("ModalText", "Looks like you have an infite loop, please check your code!");
						worker.terminate();
					}
				}
			}
        });

		//if we receive a game:lost from the server notify 
		//the user through a HTML modal popup that they have lost.
        socket.on('game:lost', function(){
			//disable any further code checking
			clicked = false;
			solved = true;
			
            $('#answerModal').modal('show')
            setInnerHTML('ModalTitle', 'You have Lost :(');
            setColour('ModalTitle', "red");
            setInnerHTML('ModalText', 'Your partner has finished the challenge!');
			
			
			
			//emit a an elo update to the server so the server can update our elo on a loss
			socket.emit('game:eloupdate', {user: window.userId});
			
			//redirect to profile page
			window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
        });

    };
	
	
	// =====================================
    // SINGLEPLAYER ========================
    // =====================================
	if (document.title === 'Single Player Challenge') {
	
        var socket = io(),
            challengerSocket;
		
		// Submit message to server asking for single player challenge.
        socket.emit('game:single', {user: window.userId});

		//for testing purposes
        console.log(window.userId);

		//get the challenge details from the server (with a timeout to transition into the challenge)
         socket.on('game:singleAccepted', function(data) {
			setTimeout(function(){ 
				
				//timeout to switch the favicon to the 'in game' favicon (chrome bug fix: https://code.google.com/p/chromium/issues/detail?id=99549)
				window.setTimeout( function(event) { favicon.change("img/favicon2.ico"); }, 110);
				
				window.onbeforeunload = function (e) {
					var message = "You haven't finished your challenge!";
					return message;
				}
		
				window.onunload = function(){
					$("#forfeit" ).trigger( "click" );
				}
				
				challengeDetail = challenges[data.challenge];
				$('.challenge-description').text(challengeDetail.description);
				$('.finding-challenger').hide();
				$('.challenge').show();
				startClock('progress1', challengeDetail.bronze);		
			},2000);
        });
		
		
		//if we cancel a game
        $('#forfeit').click(function(e) {
			window.onbeforeunload=null;
			
			$(".forfeit-clicked" ).trigger( "click" );
			setInnerHTML("ModalTitle", "Leaving Game...");
			setInnerHTML("ModalText", 'You will be redirected in a few moments');
				
			//redirect to profile page
			window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
		
        });
		
		//Inform user there are no available challenges
		socket.on('game:noneAvailable', function(data) {
		console.log('test');
			setTimeout(function(){ 
				$('.finding-challenger').hide();
				$('.none-available').show();
			},1000);
        });

		//so user can't submit correct answer over and over
		var clicked = true
		
		//process the user code when they click the submit code button. 
		//Send a game:singleCheck to server if the result is correct
        $('.submit-code').click(function(e) {
		
			if(clicked){
			
				var finalCode = editor.getValue();
				setInnerHTML("ModalTitle", "Processing your code...");
				setInnerHTML("ModalText", '<img class="img-responsive img-rounded center-block" src="img/loadingsmall.gif">');
	
				var workerResponse = '';
				var worker = new Worker("js/worker.js");
 
				worker.addEventListener('message', function(e) {
					workerResponse = e.data;
				}, false);
 
				worker.postMessage(({'cmd': 'start', 'msg': finalCode}));
				//console.log(workerResponse);
	
				var myVar;
				
				function timeout(){
					if(workerResponse == 'done'){
						var correct = challengeDetail.calculate(finalCode);
						var gold = challengeDetail.gold;
						var silver = challengeDetail.silver;
						var bronze = challengeDetail.bronze;
						var result = showResultSingle(correct, gold, silver, bronze);
						
						if(correct == 'correct'){
							window.onbeforeunload = null;
							window.unload = null;
							socket.emit('game:singleCheck', {user: window.userId, res:result, challengeID: challengeDetail.challengeId});
							
							//prevent user from re-clicking submit
							clicked = false;
							
							//redirect to profile page
							window.setTimeout( function(event) { window.location = "/profile"; }, 3000);
						};
					}else{
						setInnerHTML("ModalTitle", "Checking Code");
						setInnerHTML("ModalText", "Looks like you have an infite loop, please check your code!");
						worker.terminate();
					}
				}
				
				myVar = setTimeout(timeout, 3000);
			}

				

				
		});
    };


});



// =====================================
//  END OF FILE ========================
// =====================================
