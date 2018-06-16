import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
declare var Plaid: any;

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  constructor(public http: HttpClient, public storageService: StorageService) { }

  launchPlaidService() {
    const token = this.checkPlaidToken();
    if (token) {
      return token;
    }
    const handler = Plaid.create({
      apiVersion: 'v2',
      clientName: 'Bank Me',
      env: environment.plaidConfig.env,
      product: ['auth', 'transactions'],
      key: environment.plaidConfig.publicKey,
      onSuccess: this.getPlaidAccess
    });
    handler.open();
  }

  getPlaidAccess(public_token) {
    return this.http.post('/api/get_access_token', {
      public_token: public_token
    }).subscribe(data => {
      if (data['error']) {
        console.error('issa error');
        // TODO: Handle error
      }
      console.log(data);
      return this.setPlaidToken(data);
    });
  }

  checkPlaidToken() {
    const token = this.storageService.getInLocal('plaid_access_token');
    const itemID = this.storageService.getInLocal('plaid_item_id');

    return token && itemID;
  }

  setPlaidToken(data) {
    this.storageService.setInLocal('plaid_item_id', data.itemID);
    return this.storageService.setInLocal('plaid_access_token', data.token);
  }
}
