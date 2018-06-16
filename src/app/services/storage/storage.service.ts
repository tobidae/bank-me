import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public db: AngularFireDatabase) {
  }

  saveInCloud(key, val) {
    const userID = this.getInLocal('userID');
    if (userID) {
      const parentRef = this.db.list(`settings/${userID}`);
      return parentRef.set(key, val);
    }
    return Promise.reject("No user ID");
  }

  getInCloud(key) {
    const userID = this.getInLocal('userID');
    return new Promise(resolve => {
      if (userID) {
        this.db.object(`settings/${userID}`).valueChanges()
          .subscribe(object => {
            resolve(object[key]);
          });
      } else {
        resolve(null);
      }
    });
  }

  setInLocal(key, val): void {
    console.log('recieved = key:' + key + 'value:' + val);
    this.storage.set(key, val);
  }

  getInLocal(key): any {
    return this.storage.get(key);
  }
}
