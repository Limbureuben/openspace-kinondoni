import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWardsComponent } from './register-wards.component';

describe('RegisterWardsComponent', () => {
  let component: RegisterWardsComponent;
  let fixture: ComponentFixture<RegisterWardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterWardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
