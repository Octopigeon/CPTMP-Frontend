import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-offer-add',
  templateUrl: './offer-add.component.html',
  styleUrls: ['./offer-add.component.styl']
})
export class OfferAddComponent implements OnInit {

  offerForm = new FormGroup({
    company: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    action: new FormControl('', Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<OfferAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: any) {

  }

  ngOnInit(): void {
  }

  cancelClose() {
    this.dialogRef.close();
  }

  getOffer() {
    // return offer
    const offer = {};
    this.dialogRef.close(offer);
  }
}
