import {Component, OnInit, ViewChild} from '@angular/core';
import {ResourceFile, Train} from "../../types/types";
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelectionList} from "@angular/material/list";
import {MatDialog} from "@angular/material/dialog";
import {SelectFileComponent} from "../../popups/select-file/select-file.component";
import {StatedFormControl} from "../../shared/stated-form-control";

@Component({
  selector: 'app-train-detail',
  templateUrl: './train-detail.component.html',
  styleUrls: ['./train-detail.component.styl']
})
export class TrainDetailComponent implements OnInit {

  @ViewChild(MatSelectionList) fileSelection: MatSelectionList;

  data: Train = {
    id: 3,
    name: '实训实训实训实训实训实训',
    organization_id: 1,
    organization: '组织1',
    start_time: 1594455135343,
    end_time: 1594455155343,
    content: '实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容实训内容',
    standard: '验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准验收标准',
    resource_lib: [{
      file_name: "db7b5936-9ceb-422a-bad3-90366432a07c.jpg",
      file_path: "/api/storage/2020/7/15/db7b5936-9ceb-422a-bad3-90366432a07c.jpg",
      file_size: 584778,
      file_type: "image/jpeg",
      created: 1594798123238,
      original_name: "2019101404.jpg"
      }, {
      file_name: "21e62a42-c557-43b5-8530-b3abab4ecee8.png",
      file_path: "/api/storage/2020/7/15/21e62a42-c557-43b5-8530-b3abab4ecee8.png",
      file_size: 1845323,
      file_type: "image/png",
      created: 1594798206653,
      original_name: "2019101403.png"
    }],
    // picking location currently not implemented
    gps_info: ''
  }

  // retrieve from backend
  organizations = {
    1: '组织1',
    2: '组织2',
    3: '组织3'
  }

  organization_list = Object.entries(this.organizations);

  // we can't use FormGroup as we customized form control
  controls: {[key: string]: StatedFormControl} = {
    name: new StatedFormControl(''),
    organization_id: new StatedFormControl(''),
    start_time: new StatedFormControl(''),
    end_time: new StatedFormControl(''),
    content: new StatedFormControl(''),
    standard: new StatedFormControl(''),
  }

  editMode: boolean = true;

  newEntry: boolean = true;

  editFile: boolean = true;

  saveChange() {

  }

  constructor(private route: ActivatedRoute, private loc: LocationService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      console.log(id);
      // TODO must have valid id (uncomment following code)
      // if (!id || !id.trim()) {
      //   this.loc.go(['/', 'not-found'])
      // }
      // TODO retrieve id from param, and data from backend (and special handling to new train)

      Object.entries(this.controls).forEach(([field, control]) => {
        if (field.endsWith('time')) {
          control.setValue(new Date(this.data[field]));
        } else {
          control.setValue(this.data[field]);
        }
      })
    })
  }

  addFile() {
    const dialogRef = this.dialog.open(SelectFileComponent, {
      data: {
        title: '上传实训资源',
        buttonHint: '选择文件',
        multiple: true
      }
    });

    dialogRef.afterClosed().subscribe((value: File[]) => {
      // TODO post selected file to backend
    })
  }

  deleteFile() {
    const files: ResourceFile[] = this.fileSelection.selectedOptions.selected.map(selection => selection.value);
    // TODO handle file delete.
  }

}

