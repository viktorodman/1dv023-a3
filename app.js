'use strict'

require('dotenv').config()

const createError = require('http-errors')
const helmet = require('helmet')
const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const { join } = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const webSocket = require('./websocket/webSocket')

// View Engine setup

app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// Additional middlewares
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'gitlab.lnu.se', 'socket.io', 'ngrok.io', 'secure.gravatar.com'],
    styleSrc: ["'self'", 'cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
    scriptSrc: ["'self'", 'cdnjs.cloudflare.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com']
  }
}))
app.use(logger('dev'))

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(join(__dirname, 'public')))

const sessionOptions = {
  name: 'so many issues',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    httpOnly: true
  }
}

app.set('socketio', io)

app.use(session(sessionOptions))

app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user
  }

  next()
})

// Routes
app.use('/', require('./routes/homeRouter'))
app.use('/issues', require('./routes/issueRouter'))
app.use('/login', require('./routes/loginRouter'))
app.use('/webhooks', require('./routes/webhookRouter'))

app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .sendFile(join(__dirname, 'views', 'errors', '404.html'))
  }

  if (err.status === 403) {
    return res
      .status(403)
      .sendFile(join(__dirname, 'views', 'errors', '403.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(join(__dirname, 'views', 'errors', '500.html'))
  }

  // Development only!
  // Only providing detailed error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
})

server.listen(8000, () => {
  console.log('Server running at http://localhost:8000')
  console.log('Press Ctrl-C to terminate...')
})

webSocket(io)
