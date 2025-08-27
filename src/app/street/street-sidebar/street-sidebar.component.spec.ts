import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetSidebarComponent } from './street-sidebar.component';

describe('StreetSidebarComponent', () => {
  let component: StreetSidebarComponent;
  let fixture: ComponentFixture<StreetSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreetSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreetSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
