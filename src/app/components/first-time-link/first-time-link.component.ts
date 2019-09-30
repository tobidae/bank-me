import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BankingService } from "../../services/banking/banking.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddPlaidInfoComponent } from "../add-plaid-info/add-plaid-info.component";

@Component({
  selector: 'app-first-time-link',
  templateUrl: './first-time-link.component.html',
  styleUrls: ['./first-time-link.component.css']
})
export class FirstTimeLinkComponent implements OnInit {
  @Output() getBankDetailsEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private bankService: BankingService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  linkBankAccount() {
    return this.bankService.launchPlaidService()
      .then(() => {
        this.getBankDetailsEmitter.emit(true);
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
