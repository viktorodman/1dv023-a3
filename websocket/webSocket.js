'use strict'
const socketController = require('../controllers/socketController')
/**
 * Routes the socket events.
 *
 * @param {object} io Socket object.
 */
function webSocket (io) {
  io.on('connect', (socket) => {
    socket.on('getissue', (projectID, issueID) => socketController.getIssue(socket, projectID, issueID))
    socket.on('postcomment', (projectID, issueID, comment) => socketController.postComment(projectID, issueID, comment))
  })
}

module.exports = webSocket
