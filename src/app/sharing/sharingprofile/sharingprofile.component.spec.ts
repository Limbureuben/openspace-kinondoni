import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingprofileComponent } from './sharingprofile.component';

describe('SharingprofileComponent', () => {
  let component: SharingprofileComponent;
  let fixture: ComponentFixture<SharingprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharingprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharingprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
