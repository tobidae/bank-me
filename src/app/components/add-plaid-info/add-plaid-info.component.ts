import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-plaid-info',
  templateUrl: './add-plaid-info.component.html',
  styleUrls: ['./add-plaid-info.component.css']
})
export class AddPlaidInfoComponent implements OnInit {
  showPlaidInstructions: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  constructor() { }

  ngOnInit() {
    this.showPlaidInstructions = true;
    this.hasNext = true;
    this.hasPrevious = false;
  }

}
