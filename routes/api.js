
// Dependencies
var express = require('express');
var router = express.Router();

const subjects = require('./api.subjects')
const problems = require('./api.problems')
const auth = require('./api.auth')
const download = require('./api.download')

// Routes
router.use('/subjects',isLoggedIn, subjects)
router.use('/download',isLoggedIn, download)
router.use('/problems',isLoggedIn, problems)
router.use('/auth', auth)

function isLoggedIn(req,res,next) {

	if(req.user){
		next()
	} else {
		res.redirect('/login')
	}
}

// Return router
module.exports = router;
