require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const db = require('./config/db')
const routes = require('./routes/routes')
const middleware = require('./localMiddlewares/middleware')
const errorHandler = require('./localMiddlewares/errors')
const logger = require('./utils/logger')
const cookieParser = require('cookie-parser')

// express app initialization
const app = express()

// morgan config
morgan.token('user-agent', (req) => req.headers['user-agent']);
morgan.token('body', (req) => JSON.stringify(req.body));

// app middleware
app.use(express.static('dist'))
// Configure CORS properly
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
  optionsSuccessStatus: 200 ,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));
app.use(cookieParser()) 
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :user-agent'));
app.use(middleware.requestLogger)

// Database initializing....
db
 .then(() => logger.info('Connected to Database'))
 .catch((error) => logger.error('Error connecting to database:', error))

// app routing
app.use('/api', routes)

//  unknown endpoint handler 
app.use(middleware.unknownEndPoint)

// error handlding
app.use(errorHandler)


module.exports = app
