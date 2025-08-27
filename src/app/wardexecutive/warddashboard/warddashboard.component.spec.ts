import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarddashboardComponent } from './warddashboard.component';

describe('WarddashboardComponent', () => {
  let component: WarddashboardComponent;
  let fixture: ComponentFixture<WarddashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarddashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarddashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
