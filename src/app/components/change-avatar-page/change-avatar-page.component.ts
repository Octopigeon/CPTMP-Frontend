import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-change-avatar-page',
  templateUrl: './change-avatar-page.component.html',
  styleUrls: ['./change-avatar-page.component.styl']
})
export class ChangeAvatarPageComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = 'assets/avatar.jpg';

  isImgChosen = false;

  constructor() { }

  ngOnInit(): void {
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.isImgChosen=true;
  }
  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

}
