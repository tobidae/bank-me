import { Request, Response, Application } from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import routes from '../api';
import config from '../config';
import * as constants from "./const";

const functions = constants.default.functions;

export default ({app}: { app: Application }) => {
  let origins: string[] = [];

  if (process.env.NODE_ENV === 'local') {
    origins = origins.concat(config.local.siteUrls);
  } else {
    origins = origins.concat(config.prod.siteUrls).concat(config.dev.siteUrls);
  }
  app.use(cors({
    origin: origins
  }));
  /**
   * API HEALTH CHECK ENDPOINTS
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  // For logging
  app.use((req: Request, res: Response, next) => {
    functions.logger.log('URL path: ' + req.path);
    next();
  });

  // Intercept options header and send output
  app.options('*', (req, res) => {
    res.send('Preflight good');
  });
  app.use(config.api.prefix, routes().noAuthApp);
  app.use(config.api.prefix, routes().app);

  app.get('*', (req, res) => {
    res.status(404).send('No no no, nothing here... keep moving');
  });
};
