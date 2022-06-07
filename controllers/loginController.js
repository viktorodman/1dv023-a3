/**
 *
 * Module for loginController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const loginController = {}
const bcrypt = require('bcrypt')

/**
 * Returns the login form.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.index = async (req, res) => {
  try {
    if (req.session.user) {
      throw new Error('A user is already logged in.')
    }
    res.render('login/index.hbs')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
 *
 * Logs in the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.indexPost = async (req, res) => {
  try {
    if (req.session.user) {
      throw new Error('A user is already logged in.')
    }

    const { username, password } = req.body
    if (!username || !password) {
      throw new Error('Please enter all fields')
    }

    const user = await loginController.authenticate(username, password)
    req.session.flash = { type: 'success', text: `Welcome ${username}` }
    req.session.user = user
    res.redirect('/issues')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/login')
  }
}

/**
 * Logs out the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.logout = async (req, res) => {
  try {
    if (!req.session.user) {
      throw new Error('No user is logged in')
    }
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/')
  }
}

loginController.authenticate = async function (username, password) {
  if (username !== process.env.USERNAME || !(await bcrypt.compare(password, process.env.PASSWORD))) {
    throw new Error('Invalid Login Attempt.')
  }

  return username
}

module.exports = loginController
