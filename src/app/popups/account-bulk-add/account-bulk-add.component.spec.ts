import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBulkAddComponent } from './account-bulk-add.component';

describe('AccountBulkAddComponent', () => {
  let component: AccountBulkAddComponent;
  let fixture: ComponentFixture<AccountBulkAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBulkAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBulkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
