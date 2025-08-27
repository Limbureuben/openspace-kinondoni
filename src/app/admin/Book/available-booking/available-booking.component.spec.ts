import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableBookingComponent } from './available-booking.component';

describe('AvailableBookingComponent', () => {
  let component: AvailableBookingComponent;
  let fixture: ComponentFixture<AvailableBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
