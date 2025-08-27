import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDirectionComponent } from './map-direction.component';

describe('MapDirectionComponent', () => {
  let component: MapDirectionComponent;
  let fixture: ComponentFixture<MapDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapDirectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
