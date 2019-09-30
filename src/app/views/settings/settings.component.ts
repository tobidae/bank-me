import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BankingService } from '../../services/banking/banking.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddPlaidInfoComponent } from "../../components/add-plaid-info/add-plaid-info.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  constructor(public bankService: BankingService, public router: Router, public modalService: NgbModal) {
  }

  ngOnInit() {
  }

  deleteAccess() {
    this.bankService.deleteAccess()
      .then(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  addPlaidInfo() {
    const addPlaidInfoRef = this.modalService.open(AddPlaidInfoComponent, {
      size: 'lg',
      windowClass: 'add-plaid-info-modal'
    });

    addPlaidInfoRef.result
      .then(() => {
      })
      .catch(err => {
      });
  }
}
