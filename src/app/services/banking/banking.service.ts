import { Http } from '@angular/http';
import { environment } from './../../../environments/environment.prod';
import { Injectable, NgZone } from '@angular/core';
import { StorageService } from '../storage/storage.service';
declare var Plaid: any;

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  constructor(public http: Http, public storageService: StorageService, public ngZone: NgZone) {

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
        product: ['auth', 'transactions'],
        key: environment.plaidConfig.publicKey,
        onSuccess: function getPlaidAccess(public_token) {
          return self.http.post('http://localhost:3000' + '/api/get_access_token', {
            public_token: public_token
          }).subscribe(data => {
            data = data.json();
            if (data['error']) {
              console.error(data['error']);
              reject(data['error']);
            }
            self.setPlaidToken(data);
            resolve(true);
          });
        },
        onError: function handleError(error) {
          reject(error);
        }
      });
      handler.open();
    });
  }

  getBankAccounts() {
    return new Promise((resolve, reject) => {
      if (this.hasPlaidAccess()) {
        this.http.post('http://localhost:3000' + '/api/accounts', {
          access_token: this.plaidAccess.access_token
        }).subscribe(data => {
          data = data.json();
          resolve(data);
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
    this.storageService.setInLocal('plaid_item_id', data.item_id);
    return this.storageService.setInLocal('plaid_access_token', data.access_token);
  }

  deleteAccess() {
    this.storageService.removeInLocal('plaid_item_id');
    this.storageService.removeInLocal('plaid_access_token');
    return Promise.resolve("done");
  }
}
