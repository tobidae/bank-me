import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe((user) => {
      this.userDetails = user;
    });
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  // signInWithPassword(value) {
  //   return new Promise<any>((resolve, reject) => {
  //     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
  //       .then(res => {
  //         resolve(res);
  //       }, err => reject(err));
  //   });
  // }

  // doRegister(value) {
  //   return new Promise<any>((resolve, reject) => {
  //     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
  //       .then(res => {
  //         resolve(res);
  //       }, err => reject(err));
  //   });
  // }

  userToken() {
    return this._firebaseAuth.auth.currentUser.getIdToken(true)
      .then(token => {
        return token;
      }, err => {
        console.log(err);
        return null;
      });
  }

  isLoggedIn(): boolean {
    return Boolean(this.userDetails);
  }

  get currentUser() {
    return new Promise((resolve) => {
      this.user.subscribe((user) => {
        resolve(user);
      });
    });
  }

  get displayName() {
    return this.userDetails.displayName || this.userDetails.email;
  }

  get userID() {
    return this.userDetails.uid;
  }

  logout() {
    return this._firebaseAuth.auth.signOut()
      .then((res) => {
        localStorage.clear();
        this.router.navigate(['/']);
      });
  }
}
