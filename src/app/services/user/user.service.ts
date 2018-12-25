import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) { }


  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(user);
        } else {
          reject('No user is logged in');
        }
      });
    });
  }

  updateCurrentUser(value) {
    return new Promise((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(() => {
        resolve(true);
      }, err => reject(err));
    });
  }
}
