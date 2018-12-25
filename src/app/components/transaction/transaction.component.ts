import { BankTransaction } from './../../shared/interfaces';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() tx: BankTransaction;

  constructor(
    private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
