import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTextareaComponent } from './single-textarea.component';

describe('SingleTextareaComponent', () => {
  let component: SingleTextareaComponent;
  let fixture: ComponentFixture<SingleTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
