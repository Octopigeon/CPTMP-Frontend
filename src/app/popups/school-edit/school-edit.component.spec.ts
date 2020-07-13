import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolEditComponent } from './school-edit.component';

describe('SchoolEditComponent', () => {
  let component: SchoolEditComponent;
  let fixture: ComponentFixture<SchoolEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
