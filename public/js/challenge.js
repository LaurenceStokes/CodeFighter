var challenges = [

	//CHALLENGE 1
	{
		challengeId: 1,
		title: 'Test One',
		description: 'Bla bla',
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
		description: 'Bla bla',
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
	}



];