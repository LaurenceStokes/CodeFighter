var io = require('socket.io'),
    onlineUsers = [];

// app/routes.js
module.exports = function(app, passport, server) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', isLoggedInHomepage, function(req, res) {
        res.render('profile', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // MULTIPLAYER =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/multiplayer', isLoggedIn, function(req, res) {
        res.render('multiplayer', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // SINGLEPLAYER ========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/single', isLoggedIn, function(req, res) {
        res.render('single', {
            user: req.user // get the user out of session and pass to template
        });
    });


    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    //I found a fix for req.logout: http://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout
    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy(function(err) {
            res.redirect('/'); //Inside a callback… bulletproof!
        });
    });

    // =====================================
    // 404 =================================
    // =====================================
    app.use(function(req, res, next) {
        res.status(404);

        //respond with html page
        if (req.accepts('html')) {
            res.render('index.ejs');
            return;
        }
    });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// route middleware to make sure for homepage
function isLoggedInHomepage(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't render the home page
    res.render('index.ejs');
}