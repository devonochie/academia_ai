const app = require('./app')
const { PORT } = require('./config/routing')
const logger = require('./utils/logger')

app.listen(PORT, () => {
   logger.info(`Server is up at http://localhost:${PORT}`)
})