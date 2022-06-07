/**
 *
 * Issue routes.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/issueController')

router.get('/', controller.authorize, controller.index)

module.exports = router
