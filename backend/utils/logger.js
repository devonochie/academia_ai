const logLevels = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
};

const log = (level, message, ...optionalParams) => {
  if (process.env.NODE_ENV === 'test' && level !== logLevels.ERROR) return;
  
  const timestamp = new Date().toISOString();
  const formattedMessage = typeof message === 'object' 
    ? JSON.stringify(message, null, 2) 
    : message;

  const logEntry = `[${timestamp}] [${level.toUpperCase()}]: ${formattedMessage}`;

  switch (level) {
    case logLevels.INFO:
      console.log(logEntry, ...optionalParams);
      break;
    case logLevels.WARN:
      console.warn(logEntry, ...optionalParams);
      break;
    case logLevels.ERROR:
      console.error(logEntry, ...optionalParams);
      break;
    case logLevels.DEBUG:
      if (process.env.NODE_ENV !== 'production') {
        console.debug(logEntry, ...optionalParams);
      }
      break;
    default:
      console.log(logEntry, ...optionalParams);
  }
};

const logger = {
  info: (message, ...params) => log(logLevels.INFO, message, ...params),
  warn: (message, ...params) => log(logLevels.WARN, message, ...params),
  error: (message, ...params) => log(logLevels.ERROR, message, ...params),
  debug: (message, ...params) => log(logLevels.DEBUG, message, ...params),
  
  // Additional utility methods
  line: () => console.log('-'.repeat(50)),
  header: (title) => {
    console.log('\n' + '='.repeat(50));
    console.log(`\t${title}`);
    console.log('='.repeat(50) + '\n');
  }
};

module.exports = logger;