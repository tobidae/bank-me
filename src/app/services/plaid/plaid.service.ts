import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { Headers, Http } from "@angular/http";
import { StorageService } from "../storage/storage.service";
import { AuthService } from "../auth/auth.service";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlaidService {
  host: string;
  headers: Headers;

  constructor(private db: AngularFireDatabase, public http: Http, public storageService: StorageService,
              public ngZone: NgZone, public authService: AuthService) {
    if (!environment.production) {
      this.host = 'http://localhost:8080';
    } else {
      this.host = '';
    }

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  setPlaidKeys(data) {
    const userID = this.authService.userID;
    return this.db.database.ref(`settings/${userID}/plaidAccess`).set(data);
  }
}
