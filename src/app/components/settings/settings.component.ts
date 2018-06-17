import { StorageService } from './../../services/storage/storage.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BankingService } from './../../services/banking/banking.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  sheetID: string;
  sheetIDError = '';
  sheetIDSuccess = '';

  constructor(public bankService: BankingService, public router: Router,
    private modalService: NgbModal, public activeModal: NgbActiveModal,
    private storageService: StorageService) { }

  ngOnInit() {
    this.getSheetID()
      .then((value: string) => {
        this.sheetID = value;
      });
  }

  deleteAccess() {
    this.bankService.deleteAccess()
      .then(() => {
        this.activeModal.dismiss();
        this.router.navigate(['/dashboard']);
      });
  }

  saveSettings() {
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
}
