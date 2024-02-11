import { TestBed } from '@angular/core/testing';

import { FlowCompanyService } from './flow-company.service';

describe('FlowCompanyService', () => {
  let service: FlowCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
