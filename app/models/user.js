/* ========================================================================
 * CodeFighter user model
 * ========================================================================
 * Copyright 2014 Laurence Stokes
 * Modified from: https://scotch.io/collections/easy-node-authentication
 * ======================================================================== */


// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
	date			 : { 
		type		 : Date	
	},
	bronze			 : { 
		type         : Number, 
		default		 : 0 
	},
	silver			: { 
		type		: Number, 
		default		: 0 
	},
	gold			: { 
		type		: Number,
		default		: 0 
	},
	multi			: { 
		type		: Number, 
		default		: 0 
	},
	mmr				: { 
		type		: Number, 
		default		: 1200 
	},
	complete		: { 
		type		: Number, 
		default		: 0 
	},
	completed		: { 
		type		: [Number] 
	}
	
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
