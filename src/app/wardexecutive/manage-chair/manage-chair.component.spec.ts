import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChairComponent } from './manage-chair.component';

describe('ManageChairComponent', () => {
  let component: ManageChairComponent;
  let fixture: ComponentFixture<ManageChairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageChairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageChairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
