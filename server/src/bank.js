'use strict';

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const moment = require('moment');
const plaid = require('plaid');

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
const PLAID_ENV = process.env.PLAID_ENV || 'development';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
var PUBLIC_TOKEN = null;

// Initialize the Plaid client
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);

function getPaginatedTransactions(input, currentOffset, transactions, callback) {
  var count = 50;
  var totalTx = 0;

  return client.getTransactions(input.access_token, input.from, input.to, {
      count: count,
      offset: currentOffset
    })
    .then(transactionsResponse => {
      totalTx = parseInt(transactionsResponse.total_transactions);
      var newTxs = transactions.concat(transactionsResponse.transactions);

      if (currentOffset < totalTx) {
        getPaginatedTransactions(input, newTxs.length, newTxs, callback);
      } else {
        callback(null, transactions);
      }
    })
    .catch(error => {
      callback(error, transactions);
    })
}

module.exports = {
  init: (request, response) => {
    response.send("API is live");
  },
  getAccessToken: (request, response) => {
    PUBLIC_TOKEN = request.body.public_token;
    client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
      if (error != null) {
        var msg = 'Could not exchange public_token!';
        console.log(msg + '\n' + new Date());
        return response.json({
          error: error
        });
      }
      return response.json({
        access_token: tokenResponse.access_token,
        item_id: tokenResponse.item_id
      });
    });
  },
  getAccounts: (request, response) => {
    // Retrieve high-level account information and account and routing numbers
    // for each account associated with the Item.
    return client.getAuth(request.body.access_token)
      .then(authResponse => {
        response.json({
          error: false,
          accounts: authResponse.accounts,
          numbers: authResponse.numbers,
        });
      })
      .catch(error => {
        var msg = 'Unable to pull accounts from the Plaid API.';
        console.log(msg + '\n' + JSON.stringify(error));
        return response.json({
          error: error.error_message,
          errorCode: error.error_code
        });
      });
  },
  getTransactions: (from, to, access_token) => {
    var transactions = [];
    var input = {
      from: from,
      to: to,
      access_token: access_token
    }

    return new Promise((resolve, reject) => {
      getPaginatedTransactions(input, 0, transactions, (err, result) => {
        if (err) {
          reject({
            error: err,
            transactions: result
          });
        }
        resolve(result);
      })
    });
  }
}
