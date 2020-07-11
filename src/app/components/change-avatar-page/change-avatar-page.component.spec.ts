import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAvatarPageComponent } from './change-avatar-page.component';

describe('ChangeAvatarPageComponent', () => {
  let component: ChangeAvatarPageComponent;
  let fixture: ComponentFixture<ChangeAvatarPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAvatarPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAvatarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
