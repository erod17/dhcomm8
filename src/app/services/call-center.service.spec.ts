import { TestBed } from '@angular/core/testing';

import { CallCenterService } from './call-center.service';

describe('CallCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallCenterService = TestBed.get(CallCenterService);
    expect(service).toBeTruthy();
  });
});
