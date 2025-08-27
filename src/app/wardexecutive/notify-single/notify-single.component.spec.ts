import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifySingleComponent } from './notify-single.component';

describe('NotifySingleComponent', () => {
  let component: NotifySingleComponent;
  let fixture: ComponentFixture<NotifySingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotifySingleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifySingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
