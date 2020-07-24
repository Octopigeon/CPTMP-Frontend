import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferAddComponent } from './offer-add.component';

describe('OfferAddComponent', () => {
  let component: OfferAddComponent;
  let fixture: ComponentFixture<OfferAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
