import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardCustomersidebarComponent } from './ward-customersidebar.component';

describe('WardCustomersidebarComponent', () => {
  let component: WardCustomersidebarComponent;
  let fixture: ComponentFixture<WardCustomersidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WardCustomersidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardCustomersidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
