import { TestBed } from '@angular/core/testing';

import { S3ManagerService } from './s3-manager.service';

describe('S3ManagerService', () => {
  let service: S3ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3ManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
