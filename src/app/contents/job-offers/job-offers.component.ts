import { Component, OnInit } from '@angular/core';
import {JobOffer} from '../../types/types';
import {MatDialog} from '@angular/material/dialog';
import {ChangeAvatarComponent} from '../../popups/change-avatar/change-avatar.component';
import {OfferAddComponent} from '../../popups/offer-add/offer-add.component';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.styl']
})
export class JobOffersComponent implements OnInit {

  admin: boolean = true;

  offers: JobOffer[] = [{
    id: 1,
    company: 'Octopigeon',
    intro_image: '/assets/logo-black.png',
    action_link: 'https://github.com'
  }, {
    id: 2,
    company: 'Octopigeon',
    intro_image: '/assets/logo-black.png',
    action_link: 'https://github.com'
  }];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  deleteOffer(offer: JobOffer) {
    // TODO delete offer

  }

  addOffer() {
    const dialogRef = this.dialog.open(OfferAddComponent);

    dialogRef.afterClosed().subscribe(offer => {
      // TODO POST offer
    });
  }
}
