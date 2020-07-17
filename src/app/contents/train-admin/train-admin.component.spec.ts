import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainAdminComponent } from './train-admin.component';

describe('TrainAdminComponent', () => {
  let component: TrainAdminComponent;
  let fixture: ComponentFixture<TrainAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
