import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityGraphComponent } from './ability-graph.component';

describe('AbilityGraphComponent', () => {
  let component: AbilityGraphComponent;
  let fixture: ComponentFixture<AbilityGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
