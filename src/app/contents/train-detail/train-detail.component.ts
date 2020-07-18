import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ResourceFile, Train, UserInfo} from "../../types/types";
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../services/location.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelectionList} from "@angular/material/list";
import {MatDialog} from "@angular/material/dialog";
import {SelectFileComponent} from "../../popups/select-file/select-file.component";
import {StatedFormControl} from "../../shared/stated-form-control";
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
  location: google.maps.LatLngLiteral = {lat: 30.5332712, lng: 114.3574959};
  zoom: number = 14;
  radius: number = 100;
  useRadius: boolean = true;

  saveChange() {

  }

  constructor(private route: ActivatedRoute,
              private loc: LocationService,
              private dialog: MatDialog,
              private msg: MessageService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
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

      // user input can change quite frequently, so debounce it to reduce request amount
      this.filteredProjects$ = this.projectInputControl.valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        map(value => this._filterProjects(value)),
        tap(projects => this.filteredProjects = projects)
      )
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

interface SimplifiedProject {
  project_id: string;
  project_name: string;
}

