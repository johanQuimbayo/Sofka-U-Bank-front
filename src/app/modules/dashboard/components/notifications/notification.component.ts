import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import Notification from 'src/app/models/notifications/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notification?: Notification;

  notificationService = inject(NotificationsService);

  ngOnInit(): void {
    this.notificationService.message$
      .subscribe(message => {
        this.notification = message
        this.reset()
      })
  }

  reset() {
    const timeout = setTimeout(() => {
      this.notification = undefined;
      clearTimeout(timeout);
    }, 3000)
  }
}
