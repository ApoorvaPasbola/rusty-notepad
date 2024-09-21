import { TestBed } from '@angular/core/testing';

import { RustyStateService } from './rusty-state.service';

describe('RustyStateService', () => {
  let service: RustyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RustyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
