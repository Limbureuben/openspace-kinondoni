import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbookigComponent } from './viewbookig.component';

describe('ViewbookigComponent', () => {
  let component: ViewbookigComponent;
  let fixture: ComponentFixture<ViewbookigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewbookigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewbookigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
