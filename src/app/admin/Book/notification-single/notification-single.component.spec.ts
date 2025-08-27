import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSingleComponent } from './notification-single.component';

describe('NotificationSingleComponent', () => {
  let component: NotificationSingleComponent;
  let fixture: ComponentFixture<NotificationSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationSingleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
