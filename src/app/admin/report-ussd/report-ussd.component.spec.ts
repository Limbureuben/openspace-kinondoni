import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUssdComponent } from './report-ussd.component';

describe('ReportUssdComponent', () => {
  let component: ReportUssdComponent;
  let fixture: ComponentFixture<ReportUssdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportUssdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportUssdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
