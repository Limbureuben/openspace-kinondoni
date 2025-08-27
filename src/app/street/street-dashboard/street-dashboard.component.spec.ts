import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetDashboardComponent } from './street-dashboard.component';

describe('StreetDashboardComponent', () => {
  let component: StreetDashboardComponent;
  let fixture: ComponentFixture<StreetDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreetDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
