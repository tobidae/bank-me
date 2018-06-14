import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import * as constants from '../../shared/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(public authService: AuthService, public storageService: StorageService) { }

  ngOnInit() {
  }

  saveHelpState(value) {
    this.storageService.saveInLocal(constants.HAS_DONE_TUTORIAL, value);
  }

  get hasDoneTutorial() {
    return this.storageService.getInLocal(constants.HAS_DONE_TUTORIAL);
  }
}
