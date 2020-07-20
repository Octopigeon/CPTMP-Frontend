import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminComponent } from './school-admin.component';

describe('SchoolAdminComponent', () => {
  let component: SchoolAdminComponent;
  let fixture: ComponentFixture<SchoolAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
