/* ========================================================================
 * CodeFighter challenges
 * ========================================================================
 * Copyright 2014 Laurence Stokes
 * ======================================================================== */

var challenges = [

	//CHALLENGE 1
	{
		challengeId: 0,
		title: 'Test One',
		description: 'Write a function, called "test", that takes two explicit parameters, "a" and "b" and returns the result of "a * b"',
		calculate: function(userAnswer, window, parent, document) {

		try{
			//get two number betweens 1 and 100 to test
			rand1 = Math.floor((Math.random() * 100) + 1);
			rand2 = Math.floor((Math.random() * 100) + 1);

			if(eval(userAnswer + 'test(rand1,rand2) == rand1 * rand2;')){
				return 'correct';
			}else{
				return 'incorrect';
			}

		}catch (e) {
				return e;
			}
		},
		gold: 15,
		silver: 30,
		bronze: 60
	},
	
	//CHALLENGE 2
	{
		challengeId: 1,
		title: 'Test Two',
		description: "Write a function, called 'test', that takes two explicit parameters, 'a' and 'b' and returns the result of 'a^b'",
		calculate: function(userAnswer, window, parent, document) {

		try{
			//get two number betweens 1 and 100 to test
			rand1 = Math.floor((Math.random() * 100) + 1);
			rand2 = Math.floor((Math.random() * 100) + 1);
			

			if(eval(userAnswer + 'test(rand1,rand2) == Math.pow(rand1, rand2)')){
				return 'correct';
			}else{
				return 'incorrect';
			}

		}catch (e) {
				return e;
			}
		},
		gold: 15,
		silver: 30,
		bronze: 60
	},
	
	//CHALLENGE 3
	{
		challengeId: 2,
		title: 'Test Three',
		description: "Write a function, called 'test', that takes one explicit parameter, 'n', and returns the sum of all the primes up to n ; e.g. test(5) would return 28 (2 + 3 + 5 + 7 + 11 )!",
		calculate: function(userAnswer, window, parent, document) {

		try{
		
		//get a number betweens 1 and 100 to test
		rand1 = Math.floor((Math.random() * 100) + 1);
			
			
			//A correct answer to the challenge
			function answer(n){
		
				var sieve = [];
				var i = 0;
				var maxcount = n;
				var maxsieve = 10000;
				var prime = 0;
				var sum = 0;
				var count = 0;

				// Build the Sieve.
				for (i = 2; i <= maxsieve; i++)
				{
					sieve[i] = 1;
				}

				// Use the Sieve to find primes and count them as they are found.
				for (prime = 2; prime <= maxsieve && count < maxcount; prime++)
				{
					if (sieve[prime] == 1)
					{
						count += 1;
						sum += prime;
						for (i = prime * 2; i <= maxsieve; i += prime)
						{
							sieve[i] = 0;
						}
					}
				}
					return sum;
			}
			
			if(eval(userAnswer + 'test(rand1) == answer(rand1)')){
				return 'correct';
			}else{
				return 'incorrect';
			}

		}catch (e) {
				return e;
			}
		},
		gold: 600,
		silver: 1800,
		bronze: 3600
	}



];