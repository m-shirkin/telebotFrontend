import { TestBed } from '@angular/core/testing';

import { FileApiService } from './file-api.service';

describe('FileListService', () => {
  let service: FileApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
