import { Injectable, Inject } from '@angular/core';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) {}

  saveInLocal(key, val): void {
    console.log('recieved = key:' + key + 'value:' + val);
    this.storage.set(key, val);
  }

  getInLocal(key): any {
    return this.storage.get(key);
  }
}
