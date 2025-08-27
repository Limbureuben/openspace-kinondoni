import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablereportComponent } from './availablereport.component';

describe('AvailablereportComponent', () => {
  let component: AvailablereportComponent;
  let fixture: ComponentFixture<AvailablereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailablereportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailablereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
