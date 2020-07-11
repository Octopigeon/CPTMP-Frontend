import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingAdminComponent } from './training-admin.component';

describe('TrainingAdminComponent', () => {
  let component: TrainingAdminComponent;
  let fixture: ComponentFixture<TrainingAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
