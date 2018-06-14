import { TestBed, inject } from '@angular/core/testing';

import { BankingService } from './banking.service';

describe('BankingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankingService]
    });
  });

  it('should be created', inject([BankingService], (service: BankingService) => {
    expect(service).toBeTruthy();
  }));
});
