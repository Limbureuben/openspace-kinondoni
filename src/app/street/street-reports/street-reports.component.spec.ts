import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetReportsComponent } from './street-reports.component';

describe('StreetReportsComponent', () => {
  let component: StreetReportsComponent;
  let fixture: ComponentFixture<StreetReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreetReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreetReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
