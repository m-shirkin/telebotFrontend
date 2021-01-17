import { TestBed } from '@angular/core/testing';

import { ButtonControllerFactory } from './button-controller-factory.service';

describe('ButtonControllerFactoryService', () => {
  let service: ButtonControllerFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonControllerFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
