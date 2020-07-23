import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSignComponent } from './location-sign.component';

describe('LocationSignComponent', () => {
  let component: LocationSignComponent;
  let fixture: ComponentFixture<LocationSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
