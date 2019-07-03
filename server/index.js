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

router.get('/categories', (request, response) => {
  bank.getCategories(request, response);
});

router.get('/logout', (request, response) => {
  const access_token = request.body.access_token;
  bank.deleteAccess(access_token);
});

router.post('/transactions', (request, response) => {
  response.setHeader('Content-Type', 'application/json');

  var startDate = request.body.from;
  var endDate = request.body.to;
  var access_token = request.body.access_token;

  bank.getTransactions(startDate, endDate, access_token)
    .then(transactions => {
      response.json(transactions);
    })
    .catch(data => {
      response.status(400).json(error);
    });
});

router.post('/send-to-sheet', (request, response) => {
  var sheetID = request.body.sheetID;
  var transactions = request.body.transactions;
  var startDate = request.body.from;
  var endDate = request.body.to;
  startDate = moment(startDate);
  endDate = moment(endDate);

  var range = dateRange(startDate, endDate);

  asyncUtility.eachSeries(range, (date, next) => {
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
