import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PlaidService } from "../../services/plaid/plaid.service";
import { ToastService } from "../../services/util/toast.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

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

  constructor(private router: Router, private fb: FormBuilder, private plaidService: PlaidService, private toastService: ToastService,
              private activeModal: NgbActiveModal) {
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
    this.plaidService.setPlaidKeys(data)
      .then(() => {
        this.activeModal.dismiss();
        this.toastService.success("Added Plaid keys to database, you can now view your bank accounts");
      })
      .catch(err => {
        this.toastService.error(err, "There was an error!");
      });
  }

  cancelForm() {
    this.router.navigate(['/dashboard']);
  }

}
