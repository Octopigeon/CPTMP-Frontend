import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePageComponent } from './safe-page.component';

describe('SafePageComponent', () => {
  let component: SafePageComponent;
  let fixture: ComponentFixture<SafePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
