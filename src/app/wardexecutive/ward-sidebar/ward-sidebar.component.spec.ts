import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardSidebarComponent } from './ward-sidebar.component';

describe('WardSidebarComponent', () => {
  let component: WardSidebarComponent;
  let fixture: ComponentFixture<WardSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WardSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
