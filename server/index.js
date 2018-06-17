'use strict';

var express = require('express');
var router = express.Router();

var bank = require('./src/bank');
var sheet = require('./src/sheet');
var moment = require('moment');
var asyncUtility = require('async');

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
  var startDate = request.body.from;
  var endDate = request.body.to;
  var access_token = request.body.access_token;
  var range = dateRange(startDate, endDate);
  var allTx = [];
  response.setHeader('Content-Type', 'application/json');

  asyncUtility.eachSeries(range, (date, next) => {
    console.log(date);
    bank.getTransactions(date, access_token)
      .then(transactions => {
        allTx += transactions;
        next();
      });
  }, (err) => {
    response.end(allTx);
  });
});

router.post('/send-to-sheet', (request, response) => {
  var sheetID = request.body.sheetID;
  var transactions = request.body.transactions;
  var startDate = request.body.from;
  var endDate = request.body.to;
  var range = dateRange(startDate, endDate);

  asyncUtility.eachSeries(range, (date, next) => {
    console.log(date);
    sheet.exportTransactions(sheetID, transactions, date)
      .then((data) => {
        response.write(data);
        next();
      });
  }, (err) => {
    sheet.exportTransactions(sheetID, allTx, "All TX")
      .then((data) => {
        response.end(data);
      });
  });
});

module.exports = router;
