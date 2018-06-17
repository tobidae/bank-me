import { BankingService } from './../../services/banking/banking.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import * as constants from '../../shared/constants';
import { BankAccount, AccountBalance, AccountInfo, BankTransaction } from '../../shared/interfaces';
import { NgbDateStruct, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [NgbDatepickerConfig]
})
export class DashboardComponent implements OnInit {
  sheetID: string;
  sheetIDError = '';
  sheetIDSuccess = '';

  accountDetails: BankAccount[];

  errorMessage: string;

  hoveredDate: NgbDateStruct;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;

  constructor(public authService: AuthService, public storageService: StorageService,
    public bankService: BankingService, public calendar: NgbCalendar,
    public calendarConfig: NgbDatepickerConfig) {

    this.minDate = calendar.getPrev(calendar.getToday(), 'm', 24);
    this.maxDate = calendar.getToday();
    this.toDate = calendar.getToday();
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 30);
  }

  ngOnInit() {
    this.getSheetID()
      .then((value: string) => {
        this.sheetID = value;
      });
    this.getBankDetails();
  }

  linkBankAccount() {
    return this.bankService.launchPlaidService()
      .then(() => {
        this.getBankDetails();
      });
  }

  getBankDetails() {
    return this.bankService.getBankAccounts()
      .then(data => {
        if (data) {
          if (data['error']) {
            // Lazy error handling, errors here usually have something to do with the account type
            // Loan payment accounts may not come up well (mine didn't)
            this.errorMessage = data['error'];
            return;
          }
          this.accountDetails = data['accounts'];
        }
      });
  }

  saveSheetID() {
    if (this.sheetID) {
      this.sheetIDError = '';
      this.storageService.saveInCloud('sheetID', this.sheetID)
        .then(() => {
          this.sheetIDSuccess = 'Added sheet ID to server';
          this.sheetIDError = '';
        })
        .catch(error => {
          this.sheetIDError = error;
          this.sheetIDSuccess = '';
        });
    } else {
      this.sheetIDError = 'Please enter a sheet ID';
      this.sheetIDSuccess = '';
    }
  }

  getSheetID() {
    return this.storageService.getInCloud('sheetID');
  }

  saveHelpState(value) {
    this.storageService.setInLocal(constants.HAS_DONE_TUTORIAL, value);
  }

  get hasDoneTutorial() {
    return this.storageService.getInLocal(constants.HAS_DONE_TUTORIAL);
  }

  get hasPlaidAccess() {
    return this.bankService.hasPlaidAccess();
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isNotInRange = date => after(date, this.maxDate) || before(date, this.minDate);
  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);
}
