import { SettingsComponent } from './../settings/settings.component';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { BankingService } from '../../services/banking/banking.service';
import { Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() hasBankTransactions = false;
  displayName: string;

  constructor(public authService: AuthService, public bankService: BankingService,
    private modalService: NgbModal) {
    this.displayName = this.authService.displayName;
  }

  ngOnInit() {
  }

  launchSettings(content) {
    this.modalService.open(SettingsComponent).result
      .then((result) => {

      }, (reason) => {

      });
  }

}
