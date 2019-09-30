import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-plaid-info',
  templateUrl: './add-plaid-info.component.html',
  styleUrls: ['./add-plaid-info.component.css']
})
export class AddPlaidInfoComponent implements OnInit {
  showPlaidInstructions: boolean;
  showPlaidFields: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  title: string;
  currentPage: number;
  maxPage: number;

  plaidForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.maxPage = 2;
  }

  ngOnInit() {
    this.showPlaidInstructions = true;
    this.hasNext = true;
    this.hasPrevious = false;
    this.currentPage = 1;
    this.title = "Plaid Instructions";

    this.plaidForm = this.fb.group({
      clientID: ['', [Validators.required, Validators.minLength(20)]],
      publicKey: ['', [Validators.required, Validators.minLength(30)]],
      secretKey: ['', [Validators.required, Validators.minLength(30)]]
    });
  }

  switchPage(curPage) {
    this.currentPage = curPage;

    if (this.currentPage === 1) {
      this.showPlaidFields = false;
      this.showPlaidInstructions = true;
      this.hasNext = true;
      this.hasPrevious = false;
      this.title = "Plaid Instructions";
    } else if (this.currentPage === 2) {
      this.showPlaidInstructions = false;
      this.showPlaidFields = true;
      this.hasNext = false;
      this.hasPrevious = true;
      this.title = "Add Plaid Keys";
    }
  }

  submitPlaidForm() {
    const data = this.plaidForm.value;
  }

  cancelForm() {
    this.router.navigate(['/dashboard']);
  }

}
