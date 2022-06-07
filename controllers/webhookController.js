/**
 *
 * Module for webhookController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const webhookController = {}
/**
 * Handles webhook events from gitlab.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.indexPost = async (req, res) => {
  try {
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_TOKEN) {
      throw new Error('Something went wrong')
    }
    const io = req.app.get('socketio')
    const webhookObject = req.body

    switch (req.headers['x-gitlab-event']) {
      case 'Issue Hook' : issueEvent(webhookObject, io)
        break
      case 'Note Hook' : commentEvent(webhookObject, io)
        break
    }

    res.sendStatus(200)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Checks if the passed gitlab "issue event"
 * is an open or a close event.
 *
 * @param {object} webhookObject A gitlab "Issue Hook" Object.
 * @param {object} io A socket object.
 */
function issueEvent (webhookObject, io) {
  switch (webhookObject.object_attributes.action) {
    case 'open':
    case 'reopen':
      newIssue(webhookObject, io)
      break
    case 'close': closeIssue(webhookObject.object_attributes, io)
      break
  }
}

/**
 * Runs when the gitlab webhook sends out an "Note hook" event.
 *
 * @param {object} webhookObject A gitlab "Note hook" Object.
 * @param {object} io A socket object.
 */
function commentEvent (webhookObject, io) {
  if (webhookObject.object_attributes.noteable_type !== 'Issue' || webhookObject.object_attributes.system) {
    return
  }

  const commentData = {
    commentLocation: `${webhookObject.repository.name}/${webhookObject.issue.title}`,
    issueID: webhookObject.issue.iid,
    projectID: webhookObject.project_id,
    authorUrl: `https://gitlab.lnu.se/${webhookObject.user.username}`,
    author: webhookObject.user.name,
    authorImg: webhookObject.user.avatar_url,
    comment: webhookObject.object_attributes.note,
    date: webhookObject.object_attributes.created_at.slice(0, 16)
  }

  io.emit('newcomment', commentData)
}

/**
 * Runs when the a new issue is created on gitlab.
 *
 * @param {object} issueObject A gitlab "Issue Hook" object.
 * @param {object} io A socket object.
 */
function newIssue (issueObject, io) {
  const issueData = {
    title: issueObject.object_attributes.title,
    projectID: issueObject.object_attributes.project_id,
    issueID: issueObject.object_attributes.iid,
    name: issueObject.project.name
  }

  io.emit('newissue', issueData)
}

/**
 * Runs when an issue is closed on gitlab.
 *
 * @param {object} issueObject A gitlab "Issue Hook" object.
 * @param {object} io A socket object.
 */
function closeIssue (issueObject, io) {
  const issueData = {
    projectID: issueObject.project_id,
    issueID: issueObject.iid
  }

  io.emit('issueClosed', issueData)
}

module.exports = webhookController
