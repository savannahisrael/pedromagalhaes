/* eslint-disable no-unused-vars, no-console, no-unused-vars */

require('dotenv').config()
const nodeoutlook = require('nodejs-nodemailer-outlook')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const ExpressSession = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(ExpressSession)
const next = require('next')
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const { parse } = require('url')
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('./routes')
const models = require('./models')
const passportConfig = require('./services/auth')
const schema = require('./schema/schema')

// env vars
const port = parseInt(process.env.PORT, 10) || 4000
const dev = process.env.NODE_ENV === 'development'

// next.js pages directory
const app = next({ dev, dir: 'src/app' })

// handle dynamic next.js routes requests
const handle = routes.getRequestHandler(app)

// mongo connection
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connection successfully done to Mongo DB')
})

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(expressValidator())
    server.use(cookieParser())
    server.use(cors())
    server.use(bodyParser.json())

    // mongo db
    server.use(
      ExpressSession({
        secret: 'kjaigalhdenmaaesross',
        key: 'connect.sid',
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
          name: 'connect.sid',
          httpOnly: true,
          secure: 'auto',
          maxAge: 60000 * 60 * 24 * 7 // 7 days
        },
        store: new MongoStore({
          url: process.env.MONGO_URL,
          autoReconnect: true
        })
      })
    )

    // passport
    server.use(passport.initialize())
    server.use(passport.session())

    // graphql
    server.use('/graphql', graphqlHTTP(req => ({
      schema,
      context: {
        login: req.login.bind(req),
        user: req.user
      },
      graphiql: true
    })))


    // email server
    server.post(process.env.SMTP_URL, (req, res, body) => {
      console.log('SEND EMAIL REQUEST')
      console.log(req.body)
      nodeoutlook.sendEmail({
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        from: 'pedro.magalhaes@outlook.com',
        to: 'pedro.magalhaes@outlook.com',
        subject: req.body.subject,
        html: req.body.html,
        onError: (err) => {
          console.log('ERROR SEND EMAIL')
          console.log(err)
        },
        onSuccess: (data) => {
          console.log('SUCCESS SEND EMAIL')
          // console.log(data)
        }
      })
    })

    server.post('/logout', (req, res) => {
      req.logout()
      res.cookie('connect.sid', '', { maxAge: -1 })
      req.session.destroy(() => res.redirect('/'))
    })

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl
      handle(req, res, parsedUrl)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`[HOST] ${process.env.HOST}`)
      console.log(`[MONGO_URL] ${process.env.MONGO_URL}`)
      console.log(`[GRAPHQL] ${process.env.GRAPHQL}`)
    })
  })
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
