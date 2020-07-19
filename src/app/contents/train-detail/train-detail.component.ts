import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CreateTrainQ, GetOrgQ, Organization, PageInfoQ, ResourceFile, Train, TrainQ} from "../../types/types";
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelectionList} from "@angular/material/list";
import {MatDialog} from "@angular/material/dialog";
import {SelectFileComponent} from "../../popups/select-file/select-file.component";
import {StatedFormControl} from "../../shared/stated-form-control";
import {ConnectionService} from "../../services/connection.service";
import {Logger} from "../../services/logger.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MessageService} from "../../services/message.service";
import {debounceTime, distinctUntilChanged, map, startWith, tap} from "rxjs/operators";
import {animate, state, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-train-detail',
  templateUrl: './train-detail.component.html',
  styleUrls: ['./train-detail.component.styl'],
  animations: [
    trigger('displayRadius', [
      state('hidden', style({height: '0px', minHeight: '0'})),
      state('display', style({height: '*'})),
      transition('hidden <=> display', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TrainDetailComponent implements OnInit {

  @ViewChild(MatSelectionList) fileSelection: MatSelectionList;
  @ViewChild('projectInput') projectInput: ElementRef<HTMLInputElement>;

  data: Train;

  newTrain: Train = {
    id: null,
    name: '新实训',
    organization_id: 0,
    organization: '请选择组织',
    start_time: 1594455135343,
    end_time: 1594455155343,
    content: '请编辑实训内容',
    standard: '请编辑实训标准',
    resource_lib: [],
    // picking location currently not implemented
    gps_info: '0'
  }

  err: Train = {
    id: 0,
    name: 'ERROR',
    organization_id: 0,
    organization: 'ERROR',
    start_time: 1594455135343,
    end_time: 1594455155343,
    content: 'ERROR',
    standard: 'ERROR',
    resource_lib: [],
    // picking location currently not implemented
    gps_info: ' '
  }

  // retrieve from backend
  organizations = new Map<number, string>();

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

  projects = {
    1: 'Project1dtnhfvnrtyytryvrncty',
    2: 'Project2tycbtynbtnerrtbvrt',
    3: 'Project3ybnyujmyumncrtydvgbrgb'
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  projectInputControl = new FormControl();
  filteredProjects$: Observable<SimplifiedProject[]>;
  filteredProjects: SimplifiedProject[];
  // should be sync with users
  projectIDs = new Set(["1"]);
  selectedProjects: SimplifiedProject[] = [{
    project_id: "1",
    project_name: 'Project1dtnhfvnrtyytryvrncty'
  }];
  projectEditing: boolean = false;

  projects$: Observable<[string, string][]>;

  private _filterProjects(value: string): SimplifiedProject[] {
    // TODO change to real fetch (with entry count limit)
    if (!value) {
      // its meaningful to give some projects to choose even if keyword is empty
      return Object.entries(this.projects)
        .filter(([id, name]) => !this.projectIDs.has(id))
        .map(([project_id, project_name]) => { return {project_id, project_name}});
    }

    const filterValue = value.toLowerCase()
    return Object.entries(this.projects)
      .filter(([id, name]) => (name.toLowerCase().includes(filterValue) && !this.projectIDs.has(id)))
      .map(([project_id, project_name]) => { return {project_id, project_name}});
  }

  removeProject(project: SimplifiedProject) {
    const index = this.selectedProjects.findIndex(value => value.project_id === project.project_id);

    if (index >= 0) {
      this.selectedProjects.splice(index, 1);
      this.projectIDs.delete(project.project_id);
    }
  }

  // no need to handle add by input event
  addProject(e: MatChipInputEvent) {
    const input = e.input;

    if (this.filteredProjects.length === 0) {
      this.msg.SendMessage(`没有满足查询条件「${e.value}」的项目`).subscribe();
    }

    if (input) {
      input.value = '';
    }

    this.projectInputControl.setValue(null);
  }

  selectProject(e: MatAutocompleteSelectedEvent) {
    const project = e.option.value as SimplifiedProject;
    if (this.selectedProjects.findIndex(u => u.project_id === project.project_id) < 0) {
      this.selectedProjects.push(project);
      this.projectIDs.add(project.project_id);
    } else {
      this.msg.SendMessage(`项目「${project.project_id}」已存在于项目列表中`).subscribe();
    }
    this.projectInput.nativeElement.value = '';
    this.projectInputControl.setValue(null);
  }

  editLoc: boolean = false;
  // location: google.maps.LatLngLiteral = {lat: 30.5332712, lng: 114.3574959};
  zoom: number = 14;
  radius: number = 100;
  useRadius: boolean = true;

  saveChange() {
    if (this.data.id === null){
      const trainQ: CreateTrainQ = {
        name: this.controls.name?.value,
        organization_id: this.controls.organization_id?.value,
        start_time: new Date(this.controls.start_time?.value).toJSON(),
        end_time: new Date(this.controls.end_time?.value).toJSON(),
        content: this.controls.content?.value,
        accept_standard: this.controls.standard?.value,
        resource_library: this.controls.resource_lib?.value,
        gps_info: '00'
      }
      this.conn.CreateTrain(trainQ).subscribe({
        next: resp => {
          if (resp.status === 0) {
            this.msg.SendMessage('创建实训成功').subscribe()
          } else {
            this.msg.SendMessage('创建实训失败').subscribe()
          }
        },
        error: () => {
          this.msg.SendMessage('创建实训失败。未知错误').subscribe()
        }
      })
    }else{
      const trainQ: TrainQ = {
        id: this.data.id,
        name: this.controls.name?.value,
        organization_id: this.controls.organization_id?.value,
        start_time: new Date(this.controls.start_time?.value).toJSON(),
        end_time: new Date(this.controls.end_time?.value).toJSON(),
        content: this.controls.content?.value,
        accept_standard: this.controls.standard?.value,
        resource_library: this.controls.resource_lib?.value,
        gps_info: this.controls.gps_info?.value
      }
    }
  }

  constructor(private route: ActivatedRoute,
              private loc: LocationService,
              private dialog: MatDialog,
              private conn: ConnectionService,
              private logger: Logger,
              private msg: MessageService) { }


  ngOnInit(): void {
    console.log(123)
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.GetOrgInfo()
      // TODO must have valid id (uncomment following code)
      // if (!id || !id.trim()) {
      //   this.loc.go(['/', 'not-found'])
      // }
      // TODO retrieve id from param, and data from backend (and special handling to new train)
      if (id === 'new'){
        this.data = this.newTrain;
        this.setData();
        this.editMode = false;
      }else{
        this.conn.GetTrain(id).subscribe({
          next: resp => {
            if (resp.status === 0) {
              const trainQ = resp.data as TrainQ
              if(trainQ.id === undefined){
                this.data = this.err
              }
              const train: Train = {
                id: trainQ.id,
                name: trainQ.name,
                content: trainQ.content,
                organization: '',
                organization_id: trainQ.organization_id,
                start_time: new Date(trainQ.start_time).getTime(),
                end_time: new Date(trainQ.end_time).getTime(),
                standard: trainQ.accept_standard,
                gps_info: trainQ.gps_info,
                resource_lib: trainQ.resource_library
              }
              this.conn.GetOrgInfo(trainQ.organization_id).subscribe({
                next: nresp => {
                  const getOrgQ: GetOrgQ = nresp.data as GetOrgQ
                  train.organization = getOrgQ.real_name;
                },
                error: eresp => {
                  train.organization = '错误:未查到相关组织';
                }
              });
              this.data = train
              this.setData()
            } else {
              this.data = this.err
              this.setData()
              this.msg.SendMessage('获取实训信息失败。请稍后再试').subscribe()
            }
          },
          error: () => {
            this.data = this.err
            this.setData()
            this.msg.SendMessage('获取实训信息失败。未知错误').subscribe()
          }
        })
      }
    })
  }


  setData(){
    Object.entries(this.controls).forEach(([field, control]) => {
      if (field.endsWith('time')) {
        control.setValue(new Date(this.data[field]));
      } else {
        control.setValue(this.data[field]);
      }
    });

      // user input can change quite frequently, so debounce it to reduce request amount
    this.filteredProjects$ = this.projectInputControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => this._filterProjects(value)),
      tap(projects => this.filteredProjects = projects)
    )
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
      this.conn.UploadTrainFile(this.data.id, value[0]).subscribe({
        next: result => {
          this.logger.log(result)
          this.msg.SendMessage('文件上传成功').subscribe()
        },
        error: error => {
          this.logger.log(error)
          this.msg.SendMessage('文件上传失败').subscribe()
        }
      })
    })
  }

  deleteFile() {
    const files: ResourceFile[] = this.fileSelection.selectedOptions.selected.map(selection => selection.value);
    // TODO handle file delete.
  }

  GetOrgInfo(){
    const pageInfoQ: PageInfoQ = {
      page : 1,
      offset: 100
    }
    this.conn.GetAllOrg(pageInfoQ).subscribe({
      next: resp => {
        if (resp.status !== 0){
          this.organizations[0] = 'error'
          this.msg.SendMessage('获取组织列表失败').subscribe()
        }
        for (const connElement of resp.data) {
          const organization: GetOrgQ = connElement as GetOrgQ
          this.organizations.set( organization.id , organization.real_name)
        }
      },
      error: err => {
        this.organizations[0] = 'error'
        this.msg.SendMessage('获取组织列表失败。未知错误').subscribe()
      }
    })
  }

}

interface SimplifiedProject {
  project_id: string;
  project_name: string;
}

