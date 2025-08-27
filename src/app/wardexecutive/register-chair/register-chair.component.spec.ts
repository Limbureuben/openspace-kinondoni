import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterChairComponent } from './register-chair.component';

describe('RegisterChairComponent', () => {
  let component: RegisterChairComponent;
  let fixture: ComponentFixture<RegisterChairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterChairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterChairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
