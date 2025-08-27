import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardsRegisterComponent } from './wards-register.component';

describe('WardsRegisterComponent', () => {
  let component: WardsRegisterComponent;
  let fixture: ComponentFixture<WardsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WardsRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
