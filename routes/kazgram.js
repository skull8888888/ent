const express = require('express')
const router = express.Router()
const prpl = require('prpl-server')

router.use('/',prpl.makeHandler('.', {
	builds: [
		{name: process.env.MONGODB_URI ? 'kazgram/build/es5': 'kazgram'}
	]
}))

module.exports = router
