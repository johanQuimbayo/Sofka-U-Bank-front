import { TestBed } from '@angular/core/testing';

import { HistoryEventsService } from './history-events.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HistoryEventsService', () => {
  let service: HistoryEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(HistoryEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
