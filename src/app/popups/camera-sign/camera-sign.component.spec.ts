import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraSignComponent } from './camera-sign.component';

describe('CameraSignComponent', () => {
  let component: CameraSignComponent;
  let fixture: ComponentFixture<CameraSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
