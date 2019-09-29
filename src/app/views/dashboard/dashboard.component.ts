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
  accountDetails: BankAccount[];
  allTransactionDetails = {};
  transactionDetails = {};
  txSubscription: Subscription;

  errorMessage: string;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;

  isLoadingTransactions = false;

  hasNext = false;

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

    this.minDate = calendar.getPrev(calendar.getToday(), 'm', 24);
    this.maxDate = calendar.getToday();
    this.toDate = calendar.getToday();
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 30);
  }

  ngOnInit() {
    this.txSubscription = this.bankService.observableBankDetails.subscribe((details: {
      accounts: BankAccount[],
      transactions: BankTransaction[]
    }) => {
      this.allTransactionDetails = {};
      this.transactionDetails = {};

      for (const type in details) {
        if (type === "transactions") {
          for (const index in details[type]) {
            if (details[type].hasOwnProperty(index)) {
              const tx = details[type][index];
              tx.isTxSelected = false;
              this.allTransactionDetails[tx.transaction_id] = tx;
              this.transactionDetails[tx.transaction_id] = tx;
            }
          }
        }
      }

      // Check all tx by default when they are added
      this.selectAllTx = true;
      this.checkAllTx();
      if (details && this.rawCategories) {
        this.populateCategoryFilter();
      }
    });
    this.getBankDetails(true);
    this.getCategories();
    this.getTransactions();
  }

  checkAllTx() {
    this.selectAllTxText = this.selectAllTx ? "Unselect All Tx" : "Select All Tx";

    for (const txID in this.transactionDetails) {
      this.transactionDetails[txID].isTxSelected = this.selectAllTx;
    }
  }

  onCategoryChange(filter?) {
    if (!filter && this.categoryModel.length === 0) {
      this.transactionDetails = Object.assign({}, this.allTransactionDetails);
      return;
    }

    this.transactionDetails = {};

    if (filter) {
      this.categoryModel = [filter];
    }
    for (const txID in this.allTransactionDetails) {
      const tx = this.allTransactionDetails[txID];
      if (!filter) {
        this.categoryModel.forEach(category => {
          if (tx.category.indexOf(category) > -1) {
            this.transactionDetails[tx.transaction_id] = tx;
          }
        });
      } else if (tx.category.indexOf(filter) > -1) {
        this.transactionDetails[tx.transaction_id] = tx;
      }
    }
  }

  clearFilters() {
    this.categoryModel = [];
    this.onCategoryChange();

    this.selectAllTx = false;
    this.checkAllTx();
  }

  getBankDetails(value) {
    if (!value) return false;
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
          for (const detailIndex in this.accountDetails) {
            const ach = data["numbers"]["ach"];
            for (const index in ach) {
              if (ach.hasOwnProperty(index)) {
                const account_id = ach[index]["account_id"];
                if (account_id === this.accountDetails[detailIndex]["account_id"]) {
                  this.accountDetails[detailIndex]["account"] = ach[index]["account"];
                  this.accountDetails[detailIndex]["routing"] = ach[index]["routing"];
                }
              }
            }
          }
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

  exportTransactions() {
    const csvData = this.convertToCSV(this.transactionDetails);
    const a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    const blob = new Blob([csvData], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  }

  convertToCSV(obj: {}): string {
    let header = '';
    let allRows = '';
    const headers = [];

    // Get each row of the object data
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      let row = [];
      const data = obj[key];
      if (!data.isTxSelected) continue;

      // In each row, get the fields, if no header, add the keys to the headers array
      for (const rowKey in data) {
        if (!data.hasOwnProperty(rowKey) || rowKey === 'account_owner' || rowKey === 'pending_transaction_id') continue;
        if (header.length === 0 && rowKey !== 'isTxSelected') headers.push(rowKey.toUpperCase());

        row.push(data[rowKey]);
      }

      if (header.length === 0) {
        header = headers.join(', ')
          .replace('account_owner,', '')
          .replace('pending_transaction_id,', '');
        allRows += header + '\r\n';
      }

      row = row.map(cell => {
        console.log(cell);
        // if the cell is an array, we have an embedded array in the cell, flatten with | separator
        if (Array.isArray(cell)) {
          cell = cell.join('|').replace(',', ' ');
        }
        if (cell && cell.hasOwnProperty('state')) {
          cell = cell['state'];
        }
        if (cell && cell.hasOwnProperty('payment_method')) {
          cell = cell['payment_method'];
        }
        if (!cell) {
          cell = '';
        }
        return cell;
      });
      row = row.slice(0, -1);
      allRows += row + '\r\n';
    }
    return allRows;
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

    for (const txID in this.allTransactionDetails) {
      const tx = this.allTransactionDetails[txID];
      if (rawCategoriesID.indexOf(tx.category_id) < 0) {
        rawCategoriesID.push(tx.category_id);
      }
    }
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

  onTxChecked(tx: BankTransaction) {
    let counter = 0;
    this.transactionDetails[tx.transaction_id].isTxSelected = tx.isTxSelected;

    for (const id in this.transactionDetails) {
      const transaction = this.transactionDetails[id];
      if (transaction.isTxSelected) {
        counter++;
      }
    }
    this.selectAllTxText = `${counter} Tx selected`;
  }

  get hasPlaidAccess() {
    return this.bankService.hasPlaidAccess();
  }
}
