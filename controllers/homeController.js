/**
 *
 * Module for homeController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const homeController = {}

/**
 * Displays the home page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
homeController.index = async (req, res) => {
  res.render('home/index.hbs')
}

module.exports = homeController
