const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const prpl = require('prpl-server')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
 
// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ent1')
// mongoose.connect('mongodb://admin:adminRoot17!@ds253959.mlab.com:53959/heroku_139x17l1')

// Express
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/api', require('./routes/api'))

app.get('/', isLoggedIn)
app.get('/*', prpl.makeHandler('.', {
	builds: [
		{name: process.env.MONGODB_URI ? 'admin/build/es5': 'admin'}
	]
}))

function isLoggedIn(req,res,next){

	if (req.user){
		next()
	} else {
		if (req.path == '/login') {
			next()
		} else {
			res.redirect('/login')
		}
	}
}

// Start server
app.listen(process.env.PORT || 3000)
console.log('listening on port ' + (process.env.PORT || 3000))
