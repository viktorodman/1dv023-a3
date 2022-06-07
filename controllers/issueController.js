/**
 *
 * Module for issueController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const issueController = {}
const createError = require('http-errors')

/**
 * Displays the issue page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */

const fetch = require('node-fetch')

issueController.index = async (req, res) => {
  try {
    const response = await fetch(process.env.GITLAB_API_URL, {
      headers: {
        'PRIVATE-TOKEN': process.env.PERSONAL_ACCSESS_TOKEN
      }
    })

    const viewData = {
      repos: await Promise.all((await response.json())
        .map(async (repo) => ({
          course: repo.path_with_namespace.slice(0, 6),
          repoName: repo.name,
          repoID: repo.id,
          issueNames: await fetchIssueNames(repo._links.issues)
        })))
    }

    await res.render('issue/index.hbs', { viewData })
  } catch (error) {
    console.log(error)
  }
}

/**
 * Fetches all issues to the passed repo.
 *
 * @param {string} url An url to gitlabs api for issues.
 */
async function fetchIssueNames (url) {
  const response = await fetch(url, {
    headers: {
      'PRIVATE-TOKEN': process.env.PERSONAL_ACCSESS_TOKEN
    }
  })

  let repoIssues = await response.json()
  repoIssues = await repoIssues.filter(t => t.state === 'opened')
  const data = await Promise.all((await repoIssues).map(async d => {
    return {
      title: d.title,
      author: d.author.name,
      projectID: d.project_id,
      issueID: d.iid
    }
  }))

  return data
}

/**
 * Authoirizes that the user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} - Express next middleware function.
 */
issueController.authorize = (req, res, next) => {
  if (!req.session.user || req.session.user !== process.env.USERNAME) {
    return next(createError(403))
  }
  next()
}

module.exports = issueController
