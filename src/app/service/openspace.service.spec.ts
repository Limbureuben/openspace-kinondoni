import { TestBed } from '@angular/core/testing';

import { OpenspaceService } from './openspace.service';

describe('OpenspaceService', () => {
  let service: OpenspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
