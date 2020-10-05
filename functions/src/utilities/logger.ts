import * as winston from 'winston';
import * as moment from 'moment-timezone';
import {LoggingWinston} from '@google-cloud/logging-winston';
import {projectID, stackDriverServiceAccount} from './helper';

const today = moment().format('YYYYMMDD');
const options = {
  // file: {
  //   level: 'debug',
  //   filename: `./../logs/app_${today}.log`,
  //   handleExceptions: true,
  //   json: true,
  //   maxsize: 524288, // 500kb
  //   maxFiles: 5,
  //   colorize: true
  // },
  console: {
    handleExceptions: true,
    json: false,
    colorize: true
  },
};


const consoleTransport = new winston.transports.Console(options.console);
// const fileTransport = new winston.transports.File(options.file);

const stackdriverTransport = new LoggingWinston({
  projectId: projectID,
  keyFilename: stackDriverServiceAccount
});

const logFormatter = () => {
  const {combine, timestamp, printf} = winston.format;

  return combine(
      timestamp(),
      printf(info => {
        return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`;
      })
  );
};
let logger: winston.Logger | any = null;

const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;
if (process.env.NODE_ENV === 'local' || project === 'bank-me-dev') {
  logger = winston.createLogger({
    format: logFormatter(),
    level: 'debug',
    transports: [consoleTransport],
    exitOnError: false // do not exit on handled exception
  });
} else {
  logger = winston.createLogger({
    format: logFormatter(),
    level: 'info',
    transports: [consoleTransport, stackdriverTransport],
    exitOnError: false // do not exit on handled exception
  });
}

export default logger;
