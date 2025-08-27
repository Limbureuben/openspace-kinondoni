import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetDirectionComponent } from './street-direction.component';

describe('StreetDirectionComponent', () => {
  let component: StreetDirectionComponent;
  let fixture: ComponentFixture<StreetDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreetDirectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreetDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
