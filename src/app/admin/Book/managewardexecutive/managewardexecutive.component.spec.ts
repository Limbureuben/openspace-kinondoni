import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagewardexecutiveComponent } from './managewardexecutive.component';

describe('ManagewardexecutiveComponent', () => {
  let component: ManagewardexecutiveComponent;
  let fixture: ComponentFixture<ManagewardexecutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagewardexecutiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagewardexecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
