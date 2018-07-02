import { BankTransaction } from './../../shared/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionComponent } from './../../components/transaction/transaction.component';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.css']
})
export class TransactionCardComponent implements OnInit {
  @Input() tx: BankTransaction;
  @Output() checked: any = new EventEmitter<boolean>();

  isTxSelected: boolean;
  constructor(public modalService: NgbModal) { }

  ngOnInit() {
  }

  openTransaction(tx) {
    const transRef = this.modalService.open(TransactionComponent);
    transRef.componentInstance.tx = tx;
  }

  checkTx(e) {
    this.checked.emit(this.tx.isTxSelected);
  }

}
