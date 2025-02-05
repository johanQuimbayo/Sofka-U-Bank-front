import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerComponent } from './utils/load-spinner/component/spinner/spinner.component';
import { NotificationComponent } from './modules/dashboard/components/notifications/notification.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule, NotificationComponent],
    declarations: [AppComponent, SpinnerComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Sofka-U-Bank-front'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Sofka-U-Bank-front');
  });

  it(`should have as title 'Sofka-U-Bank-front'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Sofka-U-Bank-front');
  });

  it('should render spinner and notification components', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-spinner')).not.toBeNull();
    expect(compiled.querySelector('app-notification')).not.toBeNull();
  });
});
