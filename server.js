/* ========================================================================
 * CodeFighter server logic
 * ========================================================================
 * Copyright 2014 Laurence Stokes
 * Modified from: https://scotch.io/collections/easy-node-authentication
 * ======================================================================== */


// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

    // set up our express application
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(express.bodyParser()); // get information from html forms

    app.use(express.static(__dirname + '/public')); //make a public directory for static css/image files etc

    app.set('view engine', 'ejs'); // set up ejs for templating
    app.engine('html', require('ejs').renderFile);

    // required for passport
    app.use(express.session({
        secret: 'LaurenceFYP'
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport, server); // load our routes and pass in our app and fully configured passport

var server = app.listen(port, function() {
    console.log('The magic happens on port ' + port);
});

//require the socket.js file
require('./app/socket')(server);

