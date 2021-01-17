import { TestBed } from '@angular/core/testing';

import { BaseTableApiService } from './base-table-api.service';

describe('BaseTableApiService', () => {
  let service: BaseTableApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseTableApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
