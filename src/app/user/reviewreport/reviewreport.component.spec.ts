import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewreportComponent } from './reviewreport.component';

describe('ReviewreportComponent', () => {
  let component: ReviewreportComponent;
  let fixture: ComponentFixture<ReviewreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
