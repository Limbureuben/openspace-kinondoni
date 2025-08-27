import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardDiscriptionComponent } from './ward-discription.component';

describe('WardDiscriptionComponent', () => {
  let component: WardDiscriptionComponent;
  let fixture: ComponentFixture<WardDiscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WardDiscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardDiscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
