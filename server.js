const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const prpl = require('prpl-server')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const subdomain = require('express-subdomain')

// MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ent1')
mongoose.connect('mongodb://admin:adminRoot17!@ds253959.mlab.com:53959/heroku_139x17l1')

// Express
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('express-session')({
    secret: 'octopus',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


app.get('/', isLoggedIn)
app.get('/kaz', isLoggedIn)
app.get('/rus', isLoggedIn)
app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/routes/login.html')
})

app.use('/api', require('./routes/api'))
app.use(subdomain('add', require('./routes/add')))
// app.use(subdomain('kazgram', require('./routes/kazgram')))

app.get('/', require('./routes/api.download'))
app.get('/kaz', require('./routes/api.download'))
app.get('/rus', require('./routes/api.download'))

function isLoggedIn(req,res,next){

	res.set({
		"Cache-Control":  'no-cache, no-store, must-revalidate'
	})

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
