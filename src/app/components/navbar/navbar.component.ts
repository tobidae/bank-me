import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { BankingService } from '../../services/banking/banking.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() hasBankTransactions = false;
  displayName: string;

  constructor(public authService: AuthService, public bankService: BankingService,
              private modalService: NgbModal, private router: Router) {
    this.displayName = this.authService.displayName;
  }

  ngOnInit() {
  }

  launchSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.authService.logout()
      .then(() => {
        return this.bankService.deleteAccess();
      });
  }

}
