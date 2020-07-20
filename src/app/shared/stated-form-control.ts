import {FormControl} from "@angular/forms";

export class StatedFormControl extends FormControl {
  public editing: boolean = false;
  public switchEdit(edit?: boolean) {
    this.editing = typeof edit === 'undefined' ? !this.editing : edit;
  }

  constructor(...args) {
    super(arguments);
  }
}
