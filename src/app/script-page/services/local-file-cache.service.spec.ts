import { TestBed } from '@angular/core/testing';

import { LocalFileCacheService } from './local-file-cache.service';

describe('LocalFileService', () => {
  let service: LocalFileCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalFileCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
