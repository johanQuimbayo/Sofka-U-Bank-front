import { TestBed } from '@angular/core/testing';

import { HistoryEventsService } from './history-events.service';

describe('HistoryEventsService', () => {
  let service: HistoryEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
