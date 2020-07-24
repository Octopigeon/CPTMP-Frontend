import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {JobOfferQ} from "../../types/types";

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
    const offer: JobOfferQ = {
      photo: this.offerForm.controls.image.value,
      title: this.offerForm.controls.company.value,
      start_time: new Date().toJSON(),
      end_time: new Date().toJSON(),
      website_url: this.offerForm.controls.action.value,
    }
    this.dialogRef.close(offer);
  }
}
