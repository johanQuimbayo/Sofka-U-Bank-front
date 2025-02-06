import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationsService } from './notifications.service';
import Notification from 'src/app/models/notification';
import { HttpClient } from '@angular/common/http';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NotificationsService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
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
