import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import Notification from 'src/app/models/notification';
import { By } from '@angular/platform-browser';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  let notificationService: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ NotificationComponent ] ,
    });

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;

    notificationService = TestBed.inject(NotificationsService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Unit tests', () => {
    it('should reset notification', fakeAsync(() => {
      component.reset();
      tick(3000);

      expect(component.notification).toBeUndefined();
    }));
  });

  describe('Integration tests', () => {
    it('should render success notification on sent and reset after 3 seconds', fakeAsync(() => {
      const notification: Notification = { type: 'success', message: 'test' };

      notificationService.notify(notification);

      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.notification'))?.nativeElement;

      expect(component.notification).toEqual(notification);

      expect(container).toBeTruthy();
      expect(container?.textContent).toContain(notification.message);
      expect(container?.classList).toContain('success');

      tick(3000);

      fixture.detectChanges();

      expect(component.notification).toBeUndefined();
      expect(fixture.debugElement.query(By.css('.notification'))).toBeFalsy();
    }));

    it('should render error notification on sent and reset after 3 seconds', fakeAsync(() => {
      const notification: Notification = { type: 'error', message: 'test' };

      notificationService.notify(notification);

      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.notification'))?.nativeElement;

      expect(component.notification).toEqual(notification);

      expect(container).toBeTruthy();
      expect(container?.textContent).toContain(notification.message);
      expect(container?.classList).toContain('error');

      tick(3000);

      fixture.detectChanges();

      expect(component.notification).toBeUndefined();
      expect(fixture.debugElement.query(By.css('.notification'))).toBeFalsy();
    }));
  });
});
