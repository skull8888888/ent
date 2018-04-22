const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const User = require('../models/account')
const router = express.Router()

router.route('/register')
.post((req, res) => {

    User.register({username: req.body.username }, req.body.password, function(err, user) {
        if (err) {
            res.json(err)
            return
        }

        res.json('registered')

    })
})

router.route('/login')
.post(passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login' }), (req, res) => {
    // res.redirect('/')
    res.json('logged in ')
})

module.exports = router;
