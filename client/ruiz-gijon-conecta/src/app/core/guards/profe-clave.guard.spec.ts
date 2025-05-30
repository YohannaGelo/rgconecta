import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { profeClaveGuard } from './profe-clave.guard';

describe('profeClaveGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => profeClaveGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
