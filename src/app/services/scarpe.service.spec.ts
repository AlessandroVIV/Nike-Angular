import { TestBed } from '@angular/core/testing';

import { ScarpeService } from './scarpe.service';

describe('ScarpeService', () => {
  let service: ScarpeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScarpeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
