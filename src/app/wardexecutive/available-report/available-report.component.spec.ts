import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableReportComponent } from './available-report.component';

describe('AvailableReportComponent', () => {
  let component: AvailableReportComponent;
  let fixture: ComponentFixture<AvailableReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
