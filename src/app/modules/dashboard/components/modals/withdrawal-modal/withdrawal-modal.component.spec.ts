import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { WithdrawalModalComponent } from './withdrawal-modal.component';
import { TransactionService } from 'src/app/services/transactions/transaction.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { SpinnerService } from 'src/app/utils/load-spinner/service/spinner.service';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { TransactionRequest, TransactionResponse } from 'src/app/dtos/transaction.dto';
import { of, throwError } from 'rxjs';
import Notification from 'src/app/models/notification';

describe('WithdrawalModalComponent', () => {
  let component: WithdrawalModalComponent;
  let fixture: ComponentFixture<WithdrawalModalComponent>;

  const mockAccountId = "1";

  const mockInputAmountId = '#withdrawal-amount-input';

  const mockSuccessNotification: Notification = {
    type: 'success',
    message: 'Su retiro se ha realizado con éxito'
  }

  let transactionService: jasmine.SpyObj<TransactionService>;
  let notificationService: jasmine.SpyObj<NotificationsService>;
  let spinnerService: jasmine.SpyObj<SpinnerService>;

  beforeEach(() => {
    let mockTransactionService = jasmine
      .createSpyObj('TransactionService', ['perform']);

    let mockNotificationService = jasmine
      .createSpyObj('NotificationsService', ['notify']);

    let mockSpinnerService = jasmine
      .createSpyObj('SpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      declarations: [WithdrawalModalComponent],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationService
        },
        {
          provide: SpinnerService,
          useValue: mockSpinnerService
        }
      ],
      imports: [FormsModule, HttpClientModule],
    });
    fixture = TestBed.createComponent(WithdrawalModalComponent);
    component = fixture.componentInstance;

    component.accountId = mockAccountId;

    transactionService = TestBed
      .inject(TransactionService) as jasmine.SpyObj<TransactionService>;

    notificationService = TestBed
      .inject(NotificationsService) as jasmine.SpyObj<NotificationsService>;

    spinnerService = TestBed
      .inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.show).toBeTrue();
    expect(component.accountId).toEqual(mockAccountId);
  });

  describe('Unit tests', () => {
    it('should initialize request with transactionType WITHDRAWAL', () => {
      expect(component.request.transactionType).toBe('WITHDRAWAL');
    });

    it('should assign accountId on ngOnInit to request', () => {
      component.ngOnInit();
      expect(component.request.accountId).toBe(mockAccountId);
    });

    it('should call reset and set show to false on close' , () => {
      const form = jasmine.createSpyObj('NgForm', ['reset']);
      spyOn(component.showChange, 'emit');

      component.close(form);

      expect(component.show).toBeFalse();
      expect(component.showChange.emit).toHaveBeenCalledWith(false);
      expect(form.reset).toHaveBeenCalled();
    });

    it('should call transaction perform if form is valid on send', () => {
      const form = { invalid: false, reset: () => {} } as NgForm;

      transactionService.perform.and.returnValue(of({} as TransactionResponse));

      component.send(form);

      expect(spinnerService.show).toHaveBeenCalled();
      expect(transactionService.perform).toHaveBeenCalledWith(component.request as TransactionRequest);
    });

    it('should not call transaction perform if form is invalid on send', () => {
      const form = { invalid: true } as NgForm;

      component.send(form);

      expect(transactionService.perform).not.toHaveBeenCalled();
    });

    it('should call spinner hide on failed transaction perform in send', () => {
      const form = { invalid: false, reset: () => {} } as NgForm;

      transactionService.perform.and.returnValue(throwError(() => new Error('Error')));

      component.send(form);

      expect(spinnerService.hide).toHaveBeenCalled();
    });

    it('should call success on completed transaction perform in send', fakeAsync(() => {
      spyOn(component, 'success');
      const form = { invalid: false, reset: () => {} } as NgForm;

      transactionService.perform.and.returnValue(of({} as TransactionResponse));

      component.send(form);
      tick(500);

      expect(component.success).toHaveBeenCalledWith(form);
    }));

    it('should notify success and emit transactionCompleted on success', () => {
      const form = jasmine.createSpyObj('NgForm', ['reset']);
      spyOn(component.transactionCompleted, 'emit');
      spyOn(component, 'close');

      component.success(form);

      expect(notificationService.notify).toHaveBeenCalledWith(mockSuccessNotification);
      expect(component.transactionCompleted.emit).toHaveBeenCalled();
      expect(component.close).toHaveBeenCalledWith(form);
    });

    describe('Form validation', () => {
      beforeEach(async () => {
        await fixture.whenStable();
        fixture.detectChanges();
      });

      it('should initialize form state as invalid', () => {
        const ngForm = fixture.debugElement.query(By.directive(NgForm));
        const form = ngForm?.injector.get(NgForm);

        expect(form).toBeDefined();
        expect(form.invalid).toBeTrue();
      });

      it('should validate if required amount is present', () => {
        const input = fixture.debugElement.query(By.css(mockInputAmountId))?.nativeElement;
        input.value = '';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        const ngForm = fixture.debugElement.query(By.directive(NgForm));
        const form = ngForm?.injector.get(NgForm);

        expect(form).toBeDefined();
        expect(form.invalid).toBeTrue();
        expect(form.controls['amount'].invalid).toBeTrue();
      });

      it('should validate if amount is a number', () => {
        const input = fixture.debugElement.query(By.css(mockInputAmountId))?.nativeElement;
        input.value = 'abc';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        const ngForm = fixture.debugElement.query(By.directive(NgForm));
        const form = ngForm?.injector.get(NgForm);

        expect(form).toBeDefined();
        expect(form.invalid).toBeTrue();
        expect(form.controls['amount'].invalid).toBeTrue();
      });
    });
  });

  describe('UI tests', () => {
    beforeEach(async () => {
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should render form when show is set to true', () => {
      component.show = true;
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('.modal'))?.nativeElement;
      expect(modal).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      const input = fixture.debugElement.query(By.css(mockInputAmountId))?.nativeElement;
      expect(input.value).toEqual('');
    });

    it('should initialize with disabled button', async () => {
      const button = fixture.debugElement.query(By.css('.modal-form-button'))?.nativeElement;
      expect(button.disabled).toBeTrue();
    });

    it('should render error message when amount is invalid', async () => {
      const input = fixture.debugElement.query(By.css(mockInputAmountId))?.nativeElement;
      input.value = 'abc';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.modal-form-errors'))?.nativeElement;
      expect(error).toBeTruthy();
    });

    it('should enable button when form is valid', async () => {
      const input = fixture.debugElement.query(By.css(mockInputAmountId))?.nativeElement;
      input.value = '100';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.modal-form-button'))?.nativeElement;
      expect(button.disabled).toBeFalse();
    });
  });

  describe('Integration tests', () => {
    beforeEach(async () => {
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should close modal on close button click', async () => {
      spyOn(component, 'close').and.callThrough();
      spyOn(component.showChange, 'emit');

      const button = fixture.debugElement.query(By.css('.modal-close-button'))?.nativeElement;
      button.click();

      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('.modal'));

      const ngForm = fixture.debugElement.query(By.directive(NgForm));
      const form = ngForm?.injector.get(NgForm);

      expect(component.close).toHaveBeenCalled();
      expect(component.show).toBeFalse();
      expect(component.showChange.emit).toHaveBeenCalledWith(false);

      expect(form).toBeUndefined();
      expect(modal).toBeFalsy();
    });

    it('should send transaction request on submit valid form', fakeAsync(() => {
      spyOn(component, 'send').and.callThrough();
      spyOn(component, 'success').and.callThrough();
      spyOn(component.transactionCompleted, 'emit');

      transactionService.perform.and.returnValue(of({} as TransactionResponse));

      const input = fixture.debugElement.query(By.css(mockInputAmountId))?.nativeElement;
      input.value = '100';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.modal-form-button'))?.nativeElement;
      button.click();

      fixture.detectChanges();

      tick(500);

      expect(component.send).toHaveBeenCalled();
      expect(component.success).toHaveBeenCalled();

      expect(transactionService.perform).toHaveBeenCalled();

      expect(notificationService.notify).toHaveBeenCalledWith(mockSuccessNotification);

      expect(component.transactionCompleted.emit).toHaveBeenCalled();
    }));
  });
});
