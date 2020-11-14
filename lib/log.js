const log4js = require("log4js");

const logConfiguration =   {
  appenders: {
    file: {
      type: 'file',
      filename: 'verbose.log',
      maxLogSize: 1*1024*1024, // = 1Mb
      backups: 5, // keep five backup files
      encoding: 'utf-8',
      flags: 'a+'
    },
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: { appenders: ['file','out'], level: 'trace' }
  }
};

const logConfigurationConsole =   {
  appenders: {
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'trace' }
  }
};

log4js.configure(
  logConfigurationConsole
);

const logger = log4js.getLogger("verbose");

const NoFileLogging = (() => {
  log4js.configure(
    logConfigurationConsole
  );
});

const FileLogging = (() => {
  log4js.configure(
    logConfiguration
  );
});

module.exports = {
  logger,
  NoFileLogging,
  FileLogging
};