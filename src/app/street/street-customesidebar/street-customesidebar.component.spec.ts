import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetCustomesidebarComponent } from './street-customesidebar.component';

describe('StreetCustomesidebarComponent', () => {
  let component: StreetCustomesidebarComponent;
  let fixture: ComponentFixture<StreetCustomesidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreetCustomesidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreetCustomesidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
