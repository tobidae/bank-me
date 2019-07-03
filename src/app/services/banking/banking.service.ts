import { AuthService } from './../auth/auth.service';
import { Http, Headers } from '@angular/http';
import { environment } from './../../../environments/environment';
import { Injectable, NgZone } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import * as moment from 'moment';
import 'rxjs/add/operator/toPromise';
declare var Plaid: any;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BankTransaction, BankAccount, AccountBalance, AccountInfo } from '../../shared/interfaces';
import { d } from "@angular/core/src/render3";

@Injectable({
  providedIn: 'root'
})
export class BankingService {
  host: string;
  headers: Headers;

  observableBankDetails: BehaviorSubject<{
    accounts: BankAccount[],
    transactions: BankTransaction[]
  }>;
  txDetails: {
    accounts: BankAccount[],
    transactions: BankTransaction[]
  };

  constructor(public http: Http, public storageService: StorageService,
    public ngZone: NgZone, public authService: AuthService) {
    if (!environment.production) {
      this.host = 'http://localhost:8080';
    } else {
      this.host = '';
    }

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');

    this.observableBankDetails = new BehaviorSubject<any>(this.txDetails);
  }

  launchPlaidService() {
    const hasPlaidAccess = this.hasPlaidAccess();
    const self = this;
    if (hasPlaidAccess) {
      return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
      const handler = Plaid.create({
        apiVersion: 'v2',
        clientName: 'Bank Me',
        env: environment.plaidConfig.env,
        product: ['transactions'],
        key: environment.plaidConfig.publicKey,
        onSuccess: function (public_token) {
          return self.authService.userToken()
            .then(token => {

              if (token) {
                self.headers.set('Authorization', `Bearer ${token}`);
                return self.http.post(self.host + '/api/get_access_token', { public_token: public_token }, {
                  headers: self.headers
                })
                  .toPromise()
                  .then(data => {
                    data = data.json();
                    if (data['error']) {
                      console.error(data['error']);
                      reject(data['error']);
                    }
                    self.setPlaidToken(data);
                    resolve(true);
                  });
              }
            });
        },
        onExit: this.handleError
      });
      handler.open();
    });
  }

  getBankAccounts() {
    return new Promise((resolve, reject) => {
      if (this.hasPlaidAccess()) {

        return this.authService.userToken()
          .then(token => {

            if (token) {
              this.headers.set('Authorization', `Bearer ${token}`);
              this.http.post(this.host + '/api/accounts', { access_token: this.plaidAccess.access_token }, {
                headers: this.headers
              })
                .toPromise()
                .then(data => {
                  data = data.json();
                  resolve(data);
                });
            }
          });
      } else {
        resolve(null);
      }
    });
  }

  getBankTransactions(from, to) {
    let fromClone = Object.assign({}, from);
    let toClone = Object.assign({}, to);
    fromClone.month -= 1;
    toClone.month -= 1;
    fromClone = moment(fromClone).format('YYYY-MM-DD');
    toClone = moment(toClone).format('YYYY-MM-DD');

    return new Promise((resolve, reject) => {
      if (this.hasPlaidAccess()) {
        return this.authService.userToken()
          .then(token => {

            if (token) {
              this.headers.set('Authorization', `Bearer ${token}`);
              const body = JSON.stringify({
                access_token: this.plaidAccess.access_token,
                from: fromClone,
                to: toClone
              });
              this.http.post(this.host + '/api/transactions', body, {
                headers: this.headers
              })
                .toPromise()
                .then(data => {
                  this.txDetails = data.json();
                  this.txEventChange();
                  resolve();
                })
                .catch(error => {
                  reject(error);
                });
            }
          });

      } else {
        resolve(null);
      }
    });
  }

  txEventChange() {
    this.observableBankDetails.next(this.txDetails);
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      if (this.hasPlaidAccess()) {
        return this.authService.userToken()
          .then(token => {

            if (token) {
              this.headers.set('Authorization', `Bearer ${token}`);
              this.http.get(this.host + '/api/categories', {
                headers: this.headers
              })
                .toPromise()
                .then(data => {
                  resolve(data.json());
                })
                .catch(error => {
                  reject(error);
                });
            }
          });

      } else {
        resolve(null);
      }
    });
  }

  hasPlaidAccess() {
    const plaid = this.plaidAccess;

    return plaid.access_token && plaid.item_id;
  }

  get plaidAccess() {
    return {
      access_token: this.storageService.getInLocal('plaid_access_token'),
      item_id: this.storageService.getInLocal('plaid_item_id')
    };
  }

  setPlaidToken(data) {
    // The item ID is saved so that the system can do an automatic cleaning to free up Plaid access
    // The development limit for Plaid is 100 and it's very easy to hit that limit.
    // This is fixed by storing the itemID and after a certain period of time (every week),
    // The users that have not checked back in recently get removed from Plaid until they want access again
    // Your access token, the key that is used to view transactions is never stored in the server,
    // only locally on your machine.
    this.storageService.setInServer(`bankData/${this.authService.userID}/itemID`, data.item_id)
      .then(() => {
        this.storageService.setInLocal('plaid_item_id', data.item_id);
        return this.storageService.setInLocal('plaid_access_token', data.access_token);
      });
  }

  deleteAccess() {
    return new Promise((resolve, reject) => {
      if (this.hasPlaidAccess()) {
        return this.authService.userToken()
          .then(token => {

            if (token) {
              this.headers.set('Authorization', `Bearer ${token}`);
              this.http.get(this.host + '/api/logout', {
                headers: this.headers
              })
                .toPromise()
                .then(data => {
                  this.storageService.removeInLocal('plaid_item_id');
                  this.storageService.removeInLocal('plaid_access_token');
                  return Promise.resolve("done");
                })
                .catch(error => {
                  reject(error);
                });
            }
          });

      } else {
        resolve(null);
      }
    });
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
}
