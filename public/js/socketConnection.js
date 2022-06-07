
const socket = window.io.connect()
const issueDiv = document.querySelector('.repoCol')

socket.on('issueFound', (issue) => {
  displayIssue(issue)
  document.querySelector('#commentButton').addEventListener('click', () => {
    const currentProjectID = document.querySelector('#hiddenProjectID').value
    const currentIssueID = document.querySelector('#hiddenIssueID').value
    const comment = document.querySelector('#commentTextArea')
    socket.emit('postcomment', currentProjectID, currentIssueID, comment.value)
    comment.value = ''
  }, { once: true })
})

socket.on('newissue', (data) => {
  M.toast({ html: `New Issue in ${data.name}` })
  addNewIssue(data)
})

socket.on('issueClosed', (data) => {
  M.toast({ html: `Issue closed in ${data.name}` })
  closeIssue(data)
})

socket.on('newcomment', (data) => {
  M.toast({ html: `New comment in ${data.commentLocation}` })

  const currentProjectID = document.querySelector('#hiddenProjectID').value
  const currentIssueID = document.querySelector('#hiddenIssueID').value

  if (data.projectID === Number(currentProjectID) && data.issueID === Number(currentIssueID)) {
    const commentSection = document.querySelector('#issueComments')
    commentSection.appendChild(addComment(data))
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('.collapsible')
  const instances = M.Collapsible.init(elems)
})

issueDiv.addEventListener('click', (event) => {
  if (event.target.nodeName !== 'A' && !event.target.classList.contains('collapsible-header')) {
    return
  }

  event.target.nodeName === 'A' ? showIssue(event.target.parentElement) : removeNotification(event.target)
})

/**
 *
 * Gets the clicked issue.
 *
 * @param {object} issue An html element.
 */
function showIssue (issue) {
  const issueID = issue.querySelector('.iID').value
  const projectID = issue.querySelector('.pID').value

  const notification = issue.parentElement.querySelector('span')

  if (!notification.classList.contains('hide')) {
    notification.classList.toggle('hide')
  }

  socket.emit('getissue', projectID, issueID)
}

/**
 * Removes the issue notification.
 *
 * @param {object} project An html element.
 */
function removeNotification (project) {
  const notificationIcon = project.querySelector('.newIssue')

  if (!notificationIcon.classList.contains('hide')) {
    notificationIcon.classList.toggle('hide')
  }
}

/**
 * Updates the issue section.
 *
 * @param {object} issue An object with issue data.
 */
function displayIssue (issue) {
  const infoSection = document.querySelector('.infoSection')
  const template = document.querySelector('#issueInfo')
  const clone = template.content.cloneNode(true)

  removeChildren(infoSection)

  const commentSection = clone.querySelector('#issueComments')
  const title = clone.querySelector('#titleArea')
  const date = clone.querySelector('#dateArea')
  const author = clone.querySelector('#issueAuthor')
  const authorLink = clone.querySelector('#authorLink')
  const authorImg = clone.querySelector('#authorImage')
  const description = clone.querySelector('#issueDescription')
  const projectID = clone.querySelector('#hiddenProjectID')
  const issueID = clone.querySelector('#hiddenIssueID')

  issueID.value = issue.issueID
  projectID.value = issue.projectID
  title.textContent = issue.title
  date.textContent = `Created at: ${issue.issueDate}`
  author.textContent = issue.author
  authorLink.setAttribute('href', issue.authorUrl)
  authorImg.setAttribute('src', issue.authorImg)
  description.textContent = issue.description

  issue.comments.reverse().forEach(comment => {
    commentSection.appendChild(addComment(comment))
  })

  infoSection.appendChild(clone)
}

/**
 * Creates a new comment.
 *
 * @param {object} comment An object with comment data.
 * @returns {object} A html element.
 */
function addComment (comment) {
  const template = document.querySelector('#comment')
  const clone = template.content.cloneNode(true)

  const authorName = clone.querySelector('.commentAuthor')
  const authorImg = clone.querySelector('.commentAuthorImg')
  const commentText = clone.querySelector('.issueComment')
  const commentDate = clone.querySelector('.commentDate')
  const authorLink = clone.querySelector('.authorLink')

  authorName.textContent = comment.author
  authorImg.setAttribute('src', comment.authorImg)
  commentText.textContent = comment.comment
  commentDate.textContent = comment.date
  authorLink.setAttribute('href', comment.authorUrl)

  return clone
}

/**
 * Removes all child elements of the passed element.
 *
 * @param {object} element An html element.
 */
function removeChildren (element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild)
  }
}

/**
 * Adds a new issue to a list.
 *
 * @param {object} object IssueObject.
 */
function addNewIssue (object) {
  const projectDiv = document.querySelector(`#project${object.projectID} .collapsible-body`)
  const projectDivHeader = document.querySelector(`#project${object.projectID} .collapsible-header .newIssue`)

  const template = document.querySelector('#issue')
  const clone = template.content.cloneNode(true)

  const issueTitle = clone.querySelector('.issueTitle')
  const projectID = clone.querySelector('.pID')
  const issueID = clone.querySelector('.iID')
  const div = clone.querySelector('.issueSection')

  div.setAttribute('id', `issue${object.issueID}`)
  issueTitle.textContent = object.title
  projectID.value = object.projectID
  issueID.value = object.issueID

  if (projectDiv.querySelector('.noIssue')) {
    removeChildren(projectDiv)
    projectDiv.appendChild(clone)
  } else {
    projectDiv.prepend(clone)
  }
  notifyNewIssue(object.projectID, object.issueID)
}

/**
 * Toggles the issue notification.
 *
 * @param {number} projectID The project ID.
 * @param {number} issueID The issue ID.
 */
function notifyNewIssue (projectID, issueID) {
  const projectHeader = document.querySelector(`#project${projectID} .collapsible-header .newIssue`)
  const issueDiv = document.querySelector(`#project${projectID} #issue${issueID} span`)

  projectHeader.classList.toggle('hide')
  issueDiv.classList.toggle('hide')
}

/**
 * Removes an issue from the issue list.
 *
 * @param {object} issueObject Information about the issue.
 *
 */
function closeIssue (issueObject) {
  const projectDiv = document.querySelector(`#project${issueObject.projectID} #issue${issueObject.issueID}`)

  projectDiv.remove()
}
