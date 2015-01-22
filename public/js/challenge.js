var challenges = [

	//CHALLENGE 1
	{
		challengeId: 1,
		title: 'Test One',
		description: 'Write a function, called "test", that takes two explicit parameters, "a" and "b" and returns the result of "a * b"',
		calculate: function(userAnswer) {

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
		challengeId: 2,
		title: 'Test Two',
		description: "Write a function, called 'test', that takes two explicit parameters, 'a' and 'b' and returns the result of 'a^b'",
		calculate: function(userAnswer) {

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
		challengeId: 3,
		title: 'Test Three',
		description: "Write a function, called 'test', that takes one explicit parameter, 'n', and returns the sum of all the primes up to n ; e.g. test(5) would return 28 (2 + 3 + 5 + 7 + 11 )!",
		calculate: function(userAnswer) {

		try{
			//hardcoded the 250th result.
			if(eval(userAnswer + 'test(250) == Number(182109)')){
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