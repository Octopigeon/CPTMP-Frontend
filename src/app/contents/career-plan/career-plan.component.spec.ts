import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerPlanComponent } from './career-plan.component';

describe('CareerPlanComponent', () => {
  let component: CareerPlanComponent;
  let fixture: ComponentFixture<CareerPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
