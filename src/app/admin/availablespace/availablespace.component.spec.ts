// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { AvailablespaceComponent } from './availablespace.component';

// describe('AvailablespaceComponent', () => {
//   let component: AvailablespaceComponent;
//   let fixture: ComponentFixture<AvailablespaceComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AvailablespaceComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(AvailablespaceComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailablespaceComponent } from './availablespace.component';
import { of } from 'rxjs';
import { OpenspaceService } from '../../service/openspace.service';

describe('AvailablespaceComponent', () => {
  let component: AvailablespaceComponent;
  let fixture: ComponentFixture<AvailablespaceComponent>;
  let serviceSpy: jasmine.SpyObj<OpenspaceService>;

  beforeEach(async () => {
    // Mock the correct method from OpenspaceService
    const spy = jasmine.createSpyObj('OpenspaceService', ['getOpenSpaces']); // ✅ Ensure this method exists

    await TestBed.configureTestingModule({
      declarations: [AvailablespaceComponent],
      providers: [{ provide: OpenspaceService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AvailablespaceComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.inject(OpenspaceService) as jasmine.SpyObj<OpenspaceService>;

    // 🔥 Fix: Ensure getOpenSpaces returns an observable
    serviceSpy.getOpenSpaces.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOpenSpaces', () => {
    component.ngOnInit(); // Ensure ngOnInit() triggers service call
    expect(serviceSpy.getOpenSpaces).toHaveBeenCalled();
  });
});

