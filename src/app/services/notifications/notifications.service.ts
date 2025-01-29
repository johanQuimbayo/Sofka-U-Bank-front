import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Notification from 'src/app/models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  messageSubject = new Subject<Notification>();

  get message$() {
    return this.messageSubject.asObservable();
  }

  notify(notification: Notification) {
    this.messageSubject.next(notification);
  }
}
