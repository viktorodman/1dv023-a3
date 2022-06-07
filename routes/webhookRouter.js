/**
 *
 * Webhook routes.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const controller = require('../controllers/webhookController')

const express = require('express')
const router = express.Router()

router.post('/', controller.indexPost)

module.exports = router
