import { Component, OnInit, NgZone } from '@angular/core';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage = '';
  user = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone,
    public storageStorage: StorageService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then((res) => {
        this.saveUserDetails(res);
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
      })
      .catch((err) => console.log(err));
  }

  signInWithPassword(value) {
    this.authService.signInWithPassword(value)
      .then(res => {
        this.saveUserDetails(res);
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }

  saveUserDetails(data) {
    this.storageStorage.setInLocal('userID', data.user.uid);
  }

  ngOnInit() {
  }

}
