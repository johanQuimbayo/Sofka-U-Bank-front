import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';
import Notification from 'src/app/models/notification';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify', () => {
    const notification: Notification = { type: 'success', message: 'test' };

    service.message$.subscribe(message => {
      expect(message).toEqual(notification);
    });

    service.notify(notification);
  });
});
