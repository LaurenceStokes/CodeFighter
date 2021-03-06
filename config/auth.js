/* ========================================================================
 * CodeFighter authentication
 * ========================================================================
 * Copyright 2014 Laurence Stokes
 * Modified from: https://scotch.io/collections/easy-node-authentication
 * ======================================================================== */


// config/auth.js

// expose our config directly to our application using module.exports

//LOCAL
/**
module.exports = {

	'facebookAuth' : {
        'clientID'      : '1592265807686674', 
        'clientSecret'  : 'cb4b2a912ae1668257fcd6d81decc6e7', 
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'VRLpSApKpKBkbOg9HKUkIUUKe',
        'consumerSecret'    : 'U63VnZ3PU7TyK2MzNqZQIKAtMKiwgGom9kat1pXaoMXLHGRZoY',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    }

};
**/


//HEROKU
module.exports = {

	'facebookAuth' : {
        'clientID'      : '1592265807686674', 
        'clientSecret'  : 'cb4b2a912ae1668257fcd6d81decc6e7', 
        'callbackURL'   : 'https://codefighter.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'VRLpSApKpKBkbOg9HKUkIUUKe',
        'consumerSecret'    : 'U63VnZ3PU7TyK2MzNqZQIKAtMKiwgGom9kat1pXaoMXLHGRZoY',
        'callbackURL'       : 'https://codefighter.herokuapp.com/auth/twitter/callback'
    }

};