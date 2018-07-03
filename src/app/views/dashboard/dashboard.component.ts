import { TransactionComponent } from './../../components/transaction/transaction.component';
import { BankingService } from './../../services/banking/banking.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import * as constants from '../../shared/constants';
import { BankAccount, AccountBalance, AccountInfo, BankTransaction } from '../../shared/interfaces';
import { NgbDateStruct, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sheetID: string;
  sheetIDError = '';
  sheetIDSuccess = '';

  accountDetails: BankAccount[];
  allTransactionDetails: BankTransaction[];
  transactionDetails: BankTransaction[];
  txSubscription: Subscription;

  errorMessage: string;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;

  isLoadingTransactions = false;

  transactionList: string[];

  hasPrevious = false;
  hasNext = false;
  currentPage = 1;
  maxPage = 4;

  selectAllTx = false;
  selectAllTxText = "Select";

  categoryOptions: IMultiSelectOption[] = [];
  categoryModel: string[] = [];
  categoryOptionsText: IMultiSelectTexts = {
    searchEmptyResult: "No Category found",
    defaultTitle: "Select Category"
  };
  categoryOptionsSettings: IMultiSelectSettings = {
    buttonClasses: "btn btn-info"
  };
  rawCategories: any[];

  constructor(public authService: AuthService, public storageService: StorageService,
    public bankService: BankingService, public calendar: NgbCalendar,
    public modalService: NgbModal) {

    this.transactionList = [];
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
    this.txSubscription = this.bankService.observableTransaction.subscribe(txs => {
      this.allTransactionDetails = txs;
      this.transactionDetails = txs;
      if (txs && this.rawCategories) {
        this.populateCategoryFilter();
      }
    });
    this.getBankDetails();
    this.getCategories();
    this.getTransactions();
  }

  checkAllTx() {
    this.selectAllTxText = this.selectAllTx ? "Unselect" : "Select";
    this.transactionDetails.forEach(tx => tx.isTxSelected = this.selectAllTx);
  }

  goToNext() {
    this.hasPrevious = true;
    this.currentPage++;
    if (this.currentPage === this.maxPage) {
      this.hasNext = false;
    }
  }

  onCategoryChange(filter?) {
    if (!filter && this.categoryModel.length === 0) {
      this.transactionDetails = Object.assign([], this.allTransactionDetails);
      return;
    }

    this.transactionDetails = [];

    if (filter) {
      this.categoryModel = [filter];
    }

    this.allTransactionDetails.forEach(tx => {
      if (!filter) {
        this.categoryModel.forEach(category => {
          if (tx.category.indexOf(category) > -1) {
            this.transactionDetails.push(tx);
          }
        });
      } else if (tx.category.indexOf(filter) > -1) {
        this.transactionDetails.push(tx);
      }
    });
  }

  clearFilters() {
    this.categoryModel = [];
    this.onCategoryChange();

    this.selectAllTx = false;
    this.checkAllTx();
  }

  goToPrevious() {
    this.currentPage--;
    if (this.currentPage > 1) {
      this.hasPrevious = true;
    } else {
      this.hasPrevious = false;
      this.hasNext = true;
    }
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

  getTransactions() {
    this.clearFilters();
    this.isLoadingTransactions = true;
    return this.bankService.getBankTransactions(this.fromDate, this.toDate)
      .then(() => {
        this.isLoadingTransactions = false;
        this.hasNext = true;
      });
  }

  getCategories() {
    return this.bankService.getCategories()
      .then((categories: any) => {
        this.rawCategories = categories;
      });
  }

  populateCategoryFilter() {
    let filters = [];
    const rawCategoriesID = [];
    const categories = [];

    this.allTransactionDetails.forEach(tx => {
      if (rawCategoriesID.indexOf(tx.category_id) < 0) {
        rawCategoriesID.push(tx.category_id);
      }
    });
    filters = this.rawCategories.filter(category => {
      if (rawCategoriesID.indexOf(category.category_id) > -1) {
        return true;
      }
    });
    filters.forEach(data => {
      data.hierarchy.forEach(category => {
        if (categories.indexOf(category) < 0) {
          categories.push(category);
        }
      });
    });
    categories.sort();
    this.categoryOptions = [];
    categories.forEach(category => {
      this.categoryOptions.push({
        id: category,
        name: category
      });
    });
  }

  openTransaction(tx) {
    const transRef = this.modalService.open(TransactionComponent);
    transRef.componentInstance.tx = tx;
  }

  onTxChecked(isChecked, txID) {
    if (isChecked) {
      this.transactionList.push(txID);
    } else if (!isChecked && this.transactionList.indexOf(txID) > -1) {
      this.transactionList.splice(this.transactionList.indexOf(txID), 1);
    }
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
}
