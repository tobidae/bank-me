const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const fireAdmin = require('firebase-admin');
const cors = require('cors');
const app = express();

const api = require('./server/index');
const ignoredUrls = [];
var credentials;

if (process.env.NODE_ENV != 'production') {
  credentials = require('./server/config/service_account.json');
} else {
  credentials = JSON.parse(process.env.SERVICE_ACCOUNT);
}

fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(credentials),
  databaseURL: process.env.FIREBASE_DB_URL
});

validateFirebaseIdToken = (req, res, next) => {
  if (ignoredUrls.includes(req.path)) {
    next();
  } else {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).send({
        error: 'Unauthorized, missing authorization header!'
      });
    }

    const idToken = req.headers.authorization.split('Bearer ')[1];

    fireAdmin.auth().verifyIdToken(idToken)
      .then(user => {
        res.locals.user = user;
        return next();
      })
      .catch(error => {
        return res.status(401).send({
          error: 'Unauthorized, error verifying token!',
          info: error
        });
      });
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors({
  origin: true
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api', validateFirebaseIdToken, api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));
