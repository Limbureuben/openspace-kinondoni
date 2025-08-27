import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyBookingComponent } from './reply-booking.component';

describe('ReplyBookingComponent', () => {
  let component: ReplyBookingComponent;
  let fixture: ComponentFixture<ReplyBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplyBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
