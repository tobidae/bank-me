'use strict';

require('dotenv').config();

var express = require('express');
var router = express.Router();

var bank = require('./src/bank');
var sheet = require('./src/sheet');
var moment = require('moment');
var asyncUtility = require('async');

var APP_PORT = 8000;

function dateRange(startDate, endDate) {
  var result = [];
  const currentDate = startDate;

  while (startDate.isBefore(endDate)) {
    result.push(currentDate.format("YYYY-MM-01"));
    startDate.add(1, 'month');
  }
  result.push(endDate.format("YYYY-MM-01"));
  return result;
}

router.get('/', (request, response) => {
  bank.init(request, response);
});

router.post('/get_access_token', (request, response) => {
  bank.getAccessToken(request, response);
});

router.post('/accounts', (request, response) => {
  bank.getAccounts(request, response);
});

router.post('/transactions', (request, response) => {
  var startDate = moment(moment().subtract(23, 'months').format('YYYY-MM-DD'));
  var endDate = moment(moment().format('YYYY-MM-DD'));
  var range = dateRange(startDate, endDate);
  var allTx = [];
  response.setHeader('Content-Type', 'application/json')

  asyncUtility.eachSeries(range, function (date, next) {
    console.log(date);
    bank.getTransactions(date)
      .then(transactions => {
        allTx += transactions;
        sheet.exportTransactions(transactions, date)
          .then((data) => {
            response.write(data);
            next();
          });
      });
  }, (err) => {
    sheet.exportTransactions(allTx, "All TX")
      .then((data) => {
        response.end(data);
      });
  });
});

module.exports = router;

// var server = app.listen(APP_PORT, function () {
//   console.log('server listening on port ' + APP_PORT);
// });
