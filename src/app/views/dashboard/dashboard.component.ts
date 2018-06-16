import { BankingService } from './../../services/banking/banking.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import * as constants from '../../shared/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sheetID: string;
  sheetIDError = '';
  sheetIDSuccess = '';

  constructor(public authService: AuthService, public storageService: StorageService,
    public bankService: BankingService) {
  }

  ngOnInit() {
  }

  saveSheetID() {
    if (this.sheetID) {
      this.sheetIDError = '';
      this.storageService.saveInCloud('sheetID', this.sheetID)
        .then(res => {
          console.log("Response", res);
          this.sheetIDSuccess = 'Added sheet ID to server';
        })
        .catch(error => {
          this.sheetIDError = error;
        });
    } else {
      this.sheetIDError = 'Please enter a sheet ID';
    }
  }

  saveHelpState(value) {
    this.storageService.setInLocal(constants.HAS_DONE_TUTORIAL, value);
  }

  get hasDoneTutorial() {
    return this.storageService.getInLocal(constants.HAS_DONE_TUTORIAL);
  }

  get hasPlaidAccess() {
    return this.bankService.checkPlaidToken();
  }
}
