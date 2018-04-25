const express = require('express')
const router = express.Router()
const prpl = require('prpl-server')

router.use('/',prpl.makeHandler('.', {
	builds: [
		{name: process.env.MONGODB_URI ? 'add/build/es5': 'add'}
	]
}))

module.exports = router
