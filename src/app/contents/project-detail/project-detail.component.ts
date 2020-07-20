import {Component, OnInit, ViewChild} from '@angular/core';
import {Project, ResourceFile, Team} from "../../types/types";
import {StatedFormControl} from "../../shared/stated-form-control";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {MatSelectionList} from "@angular/material/list";
import {SelectFileComponent} from "../../popups/select-file/select-file.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.styl']
})
export class ProjectDetailComponent implements OnInit {

  @ViewChild(MatSelectionList) fileSelection: MatSelectionList;

  data: Project = {
    id: 1,
    name: "新项目",
    level: 3,
    content: "暂无项目主题",
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
  };

  controls: {[key: string]: StatedFormControl} = {
    name: new StatedFormControl(''),
    level: new StatedFormControl(''),
    content: new StatedFormControl(''),
  }

  /***
   * 根据进入此页面的链接，决定此页面是新建项目还是对原有项目进行修改
   */
  // TODO should be modified according to link (and user permission)
  editMode: boolean = true;
  editFile: boolean = true;

  constructor(private route: ActivatedRoute, private loc: LocationService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');

      // TODO must have valid id (uncomment following code)
      // if (!id || !id.trim()) {
      //   this.loc.go(['/', 'not-found'])
      // }
      // TODO retrieve id from param, and data from backend (and special handling to new project)
      if (id === 'new'){
        this.editMode = false;
      }
      Object.entries(this.controls).forEach(([field, control]) => {
        control.setValue(this.data[field]);
      })
    })
  }

  /***
   * 上传项目的对应资源
   */
  addFile() {
    const dialogRef = this.dialog.open(SelectFileComponent, {
      data: {
        title: '上传项目资源',
        buttonHint: '选择文件',
        multiple: true
      }
    });
    /***
     * 根据用户上传的文件，将其上传到服务器供其他人进行查阅
     */
    dialogRef.afterClosed().subscribe((value: File[]) => {
      // TODO post selected file to backend
    })
  }

  /***
   * 删除文件
   */
  deleteFile() {
    const files: ResourceFile[] = this.fileSelection.selectedOptions.selected.map(selection => selection.value);
    // TODO handle file delete.
  }

  /***
   * 保存对项目的修改
   */
  saveChange() {
    //TODO save edit changes to server
  }

  capLevel(level: number): number {
    if (level < 0) {
      return 0
    }
    if (level > 5) {
      return 5;
    }
    return Math.round(level)
  }

  range(count: number, begin: number = 0) {
    return [...Array(count).keys()].map(i => i + begin);
  }

}
