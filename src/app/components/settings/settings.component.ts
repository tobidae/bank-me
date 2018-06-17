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

  constructor(public bankService: BankingService,
    public router: Router, private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  deleteAccess() {
    this.bankService.deleteAccess()
      .then(() => {
        this.router.navigate(['/dashboard']);
      });
  }
  saveSettings() {

  }

}
