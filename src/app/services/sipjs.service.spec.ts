import { TestBed } from '@angular/core/testing';

import { SipjsService } from './sipjs.service';

describe('SipjsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SipjsService = TestBed.get(SipjsService);
    expect(service).toBeTruthy();
  });
});
