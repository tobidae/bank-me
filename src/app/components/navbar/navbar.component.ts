import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() hasBankTransactions = false;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
