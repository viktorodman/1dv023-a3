/**
 *
 * Module for socketController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const socketController = {}

const fetch = require('node-fetch')

/**
 * Gets the issue with the passed project and issue id.
 *
 * @param {object} socket A socket object.
 * @param {string} projectID The project id.
 * @param {string} issueID The issue id.
 */
socketController.getIssue = async (socket, projectID, issueID) => {
  try {
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/issues/${issueID}`, {
      headers: {
        'PRIVATE-TOKEN': process.env.PERSONAL_ACCSESS_TOKEN
      }
    })

    const issueObject = await response.json()

    const issue = {
      projectID: projectID,
      issueID: issueID,
      title: await issueObject.title,
      description: await issueObject.description,
      status: await issueObject.state,
      author: await issueObject.author.name,
      authorUrl: await issueObject.author.web_url,
      authorImg: await issueObject.author.avatar_url,
      issueDate: await issueObject.created_at.slice(0, 16).replace('T', ' '),
      comments: await fetchComments(await issueObject._links.notes)
    }

    socket.emit('issueFound', await issue)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Post a comment to an issue on gitlab using the gitlab api.
 *
 * @param {string} projectID The project ID.
 * @param {string} issueID The issue ID.
 * @param {string} comment The comment.
 */
socketController.postComment = async (projectID, issueID, comment) => {
  const res = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/issues/${issueID}/notes?body=${comment}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'PRIVATE-TOKEN': process.env.PERSONAL_ACCSESS_TOKEN
    }
  })

  if (await res.status !== 201) {
    throw new Error('Something went wrong')
  }
}

/**
 * Fetches all comments on an issue.
 *
 * @param {string} url An url to an issue.
 */
async function fetchComments (url) {
  const response = await fetch(url, {
    headers: {
      'PRIVATE-TOKEN': process.env.PERSONAL_ACCSESS_TOKEN
    }
  })

  const filterComments = await (await response.json()).filter(f => {
    return f.system === false
  })

  const data = await filterComments.map(d => {
    return {
      comment: d.body,
      author: d.author.name,
      authorImg: d.author.avatar_url,
      authorUrl: d.author.web_url,
      date: d.created_at.slice(0, 16).replace('T', ' ')
    }
  })
  console.log(await data)
  return data
}

module.exports = socketController
