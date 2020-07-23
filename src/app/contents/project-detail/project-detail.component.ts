import {Component, OnInit, ViewChild} from '@angular/core';
import {GetOrgQ, Project, ProjectQ, ResourceFile, Team, Train, TrainQ} from "../../types/types";
import {StatedFormControl} from "../../shared/stated-form-control";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {MatSelectionList} from "@angular/material/list";
import {SelectFileComponent} from "../../popups/select-file/select-file.component";
import {MatDialog} from "@angular/material/dialog";
import {ConnectionService} from "../../services/connection.service";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.styl']
})
export class ProjectDetailComponent implements OnInit {

  @ViewChild(MatSelectionList) fileSelection: MatSelectionList;

  newProject: Project = {
    id: 1,
    name: "新项目",
    level: 3,
    content: "暂无项目主题",
    resource_lib: null,
  };

  err: Project = {
    id: 1,
    name: "err",
    level: 3,
    content: "err",
    resource_lib: null,
  };

  data: Project = {
    id: null,
    name: "加载中……",
    level: 0,
    content: "加载中……",
    resource_lib: null,
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

  constructor(private route: ActivatedRoute,
              private loc: LocationService,
              private dialog: MatDialog,
              private conn: ConnectionService,
              private msg: MessageService,) { }

  createProject(){
    const projectQ: ProjectQ = {
      name: this.controls.name.value,
      level: this.controls.level.value,
      content: this.controls.content.value
    };
    this.conn.CreatProject(projectQ).subscribe({
      next: value => {
        if(value.status !== 0){
          this.msg.SendMessage('创建新项目失败').subscribe();
        }else{
          this.msg.SendMessage('创建新项目成功').subscribe();
        }
      },
      error: err1 => {
        this.msg.SendMessage('创建新项目失败。未知错误').subscribe();
      },
      complete: () => {
        this.loc.go(['/plat/project/']);
      }
    });
  }

  projectId: string;

  ngOnInit(): void {
    this.SetData();
    this.route.paramMap.subscribe(param => {
      this.projectId = param.get('id');

      // TODO must have valid id (uncomment following code)
      // if (!id || !id.trim()) {
      //   this.loc.go(['/', 'not-found'])
      // }
      // TODO retrieve id from param, and data from backend (and special handling to new project)
      if (this.projectId === 'new'){
        this.editMode = false;
      }
      this.GetData()
    })
  }

  SetData(){
    Object.entries(this.controls).forEach(([field, control]) => {
      control.setValue(this.data[field]);
    });
  }

  GetData(){
    if (!this.editMode){
      this.data = this.newProject;
      this.SetData();
    }else{
      this.conn.GetProject(this.projectId).subscribe({
        next: resp => {
          if (resp.status === 0) {
            const projectQ = resp.data as ProjectQ;
            const project: Project = {
              id: projectQ.id,
              name: projectQ.name,
              content: projectQ.content,
              level: projectQ.level,
              resource_lib: null
            };
            this.data = project;
            this.SetData();
          } else {
            this.data = this.err;
            this.msg.SendMessage('获取实训信息失败。请稍后再试').subscribe()
          }
        },
        error: () => {
          this.data = this.err
          this.msg.SendMessage('获取实训信息失败。未知错误').subscribe()
        }
      })
    }
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
    const projectQ: ProjectQ = {
      name: this.controls.name.value,
      level: this.controls.level.value,
      content: this.controls.content.value
    };
    this.conn.UploadProjectInfo(this.data.id, projectQ).subscribe({
      next: value => {
        if (value.status !== 0 ){
          this.msg.SendMessage('修改信息失败').subscribe();
        }else{
          this.msg.SendMessage('修改信息成功').subscribe();
        }
      },
      error: err1 => {
        this.msg.SendMessage('修改信息失败。未知错误').subscribe();
      },
      complete: () => {
        this.GetData();
      }
    })
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

  jumpToTeamList(){
    const index: string = '0&' + this.data.id;
    this.loc.go(['/plat/teamList/', index]);
  }

}
