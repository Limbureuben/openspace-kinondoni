import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardBookingComponent } from './ward-booking.component';

describe('WardBookingComponent', () => {
  let component: WardBookingComponent;
  let fixture: ComponentFixture<WardBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WardBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
