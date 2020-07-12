import {Component, Inject, OnInit} from '@angular/core';
import {ImageCroppedEvent} from "ngx-image-cropper";
import {MessageService} from "../../services/message.service";
import {Observable} from "rxjs";
import {Logger} from "../../services/logger.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.styl']
})
export class ChangeAvatarComponent implements OnInit {

  imageChangedEvent: Event = null;
  imageCroppedEvent: ImageCroppedEvent = null;
  cropDirty: boolean = false;
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.cropperUp();
  }
  imageCropped(event: ImageCroppedEvent) {
    this.logger.log('Image cropped.')
    this.imageCroppedEvent = event;
    this.cropDirty = true;
  }

  cropperUp() {
    setTimeout(() => {
      if (this.cropDirty) {
        this.croppedImage = this.imageCroppedEvent.base64;
        this.cropDirty = false;
      }
    }, 100)
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    this.msg.SendMessage('图片加载失败')
  }

  getCroppedBlob(): Observable<Blob> {
    return new Observable(sub => {
      fetch(this.croppedImage).then(
        resp => resp.blob()
      ).then(
        blob => sub.next(blob)
      ).catch(err => sub.error(err));
    })
  }

  cancelClose() {
    this.dialogRef.close();
  }

  constructor(private msg: MessageService,
              private logger: Logger,
              public dialogRef: MatDialogRef<ChangeAvatarComponent>) { }

  ngOnInit(): void {
  }

}
