import { Http } from '@angular/http';
import { environment } from './../../../environments/environment.prod';
import { Injectable, NgZone } from '@angular/core';
import { StorageService } from '../storage/storage.service';
declare var Plaid: any;

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  constructor(public http: Http, public storageService: StorageService, public ngZone: NgZone) { }

  launchPlaidService() {
    const checkForToken = this.checkPlaidToken();
    const self = this;
    if (checkForToken) {
      return;
    }
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
            // TODO: Handle error
          }
          return self.setPlaidToken(data);
        });
      }
    });
    handler.open();
  }

  checkPlaidToken() {
    const token = this.storageService.getInLocal('plaid_access_token');
    const itemID = this.storageService.getInLocal('plaid_item_id');

    return token && itemID;
  }

  setPlaidToken(data) {
    this.storageService.setInLocal('plaid_item_id', data.item_id);
    return this.storageService.setInLocal('plaid_access_token', data.access_token);
  }
}
