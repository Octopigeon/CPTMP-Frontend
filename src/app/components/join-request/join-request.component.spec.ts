import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequestComponent } from './join-request.component';

describe('JoinRequestComponent', () => {
  let component: JoinRequestComponent;
  let fixture: ComponentFixture<JoinRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
