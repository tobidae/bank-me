'use strict';

const sheets = require('google-spreadsheet');
const moment = require('moment');
const async = require('async');

// You can get this from creating a google cloud project, then creating a service account under IAM & Admin.
// NOTE: You'll have to add the client_email from the generated json to the google sheet by sharing.
// More info here https://github.com/theoephraim/node-google-spreadsheet#service-account-recommended-method
var credentials;
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
  credentials = require('./../config/service_account.json');
} else {
  credentials = JSON.parse(process.env.SERVICE_ACCOUNT);
}

// Returns created sheet
function createSheet(googleDoc, title) {
  return new Promise(resolve => {
    googleDoc.addWorksheet({
      title: title,
      rowCount: 1000,
      colCount: 10
    }, async function (err, sheet) {
      if (err) {
        console.error("Error", err);
        resolve(null);
      };

      sheet.setHeaderRow(['Name', 'Amount', 'Date', 'Type1', 'Type2', 'TxID'], function (err) {
        resolve(sheet);
      });
    });
  });
}

// Returns sheet if it exists
function checkForSheet(googleDoc, title) {
  return new Promise(resolve => {
    googleDoc.getInfo((err, info) => {
      if (err) {
        console.error("Error", err);
        resolve(null);
      }

      var monthSheet = null;
      info.worksheets.forEach(worksheet => {
        if (worksheet.title == title) {
          monthSheet = worksheet;
          return false;
        }
      });
      resolve(monthSheet);
    });
  })
}

function getRows(googleSheet) {
  return new Promise(resolve => {
    googleSheet.getRows({}, (err, rows) => {
      if (err) {
        console.error("Error", err);
        resolve(null);
      };
      resolve(rows);
    })
  })
}

function dateToFull(date) {
  return moment(date).format("MMM YYYY");
}

module.exports = {
  exportTransactions: (sheetID, transactions, title) => {
    var googleDoc = new sheets(sheetID);
    var currentTitle = title != "All TX" ? dateToFull(title) : title;
    var currentSheet = null;
    var allCurrentRows = null;

    // Auth the sheet, get all the work sheets
    // for each tx, if the currentTitle is null or not the month in tx
    return new Promise((resolve, reject) => {
      async.waterfall([
        function setAuth(step) {
          googleDoc.useServiceAccountAuth(credentials, step);
        },
        function preChecks(step) {
          // From oldest to newest since Plaid returns newest tx first
          transactions = transactions.reverse();
          checkForSheet(googleDoc, currentTitle)
            .then(currentSheet => {
              if (!currentSheet) {
                return createSheet(googleDoc, currentTitle);
              }
              return currentSheet;
            })
            .then(sheet => {
              currentSheet = sheet;
              return getRows(sheet);
            })
            .then(currentRows => {
              allCurrentRows = currentRows;
              step();
            })
            .catch(error => {
              console.log(error);
              step();
            });
        },
        function exportTx(step) {
          async.eachSeries(transactions, function (tx, stepSeries) {
            var currentRow;
            if (allCurrentRows) {
              currentRow = allCurrentRows.find(row => row.txid == tx.transaction_id);
            }
            if (!currentRow && currentSheet) {
              var newRow = {
                'Name': tx.name,
                'Amount': '$' + tx.amount,
                'Date': moment(tx.date).format('D[-]MMM'),
                'Type1': tx.category[0],
                'Type2': tx.category[1] ? tx.category[1] : '',
                'TxID': tx.transaction_id
              };
              currentSheet.addRow(newRow, function (err) {
                stepSeries();
              });
            } else {
              stepSeries();
            }
          }, (err) => {
            step();
          });
        }
      ], function (err) {
        if (err) {
          console.log("Error: ", err);
          reject(err);
        }
        resolve(`Exported ${transactions.length} transactions for ${currentTitle}`);
      });
    });
  }
}
