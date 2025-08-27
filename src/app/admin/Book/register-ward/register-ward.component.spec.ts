import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWardComponent } from './register-ward.component';

describe('RegisterWardComponent', () => {
  let component: RegisterWardComponent;
  let fixture: ComponentFixture<RegisterWardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterWardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
