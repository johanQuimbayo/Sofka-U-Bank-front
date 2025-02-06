import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CreateAccountComponent } from './create-account.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SpinnerService } from 'src/app/utils/load-spinner/service/spinner.service';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;

  const mockAccount: AccountResponse = {
    id: 1,
    type: 'Checking',
    customerId: 101,
    balance: 500,
    accountNumber: 123456
  };

  beforeEach(async () => {
    const accountSpy = jasmine.createSpyObj('AccountService', ['createAccount']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    const spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [CreateAccountComponent],
      providers: [
        { provide: AccountService, useValue: accountSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: SpinnerService, useValue: spinnerSpy }
      ],
      imports: [RouterTestingModule, FormsModule]
    }).compileComponents();

    accountServiceSpy = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spinnerServiceSpy = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
  });

  /*** Pruebas Unitarias ***/
  describe('Unit tests', () => {

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should call close when close method is triggered', () => {
      spyOn(component.closeModal, 'emit');
      component.close();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  /*** Pruebas de Integración ***/
  describe('Integration tests', () => {
    beforeEach(() => {
      authServiceSpy.getUserId.and.returnValue(101);
      accountServiceSpy.createAccount.and.returnValue(of(mockAccount));

      fixture.detectChanges();
    });

    beforeEach(() => {
      // Resetear los spies para cada prueba
      spinnerServiceSpy.show.calls.reset();
      spinnerServiceSpy.hide.calls.reset();
    });

    it('should call createAccount and emit events on success', fakeAsync(() => {
      spyOn(component.accountCreated, 'emit').and.callThrough();
      spyOn(component.closeModal, 'emit').and.callThrough();

      component.accountType = 'Checking';
      component.balance = 500;

      accountServiceSpy.createAccount.and.returnValue(of(mockAccount));

      component.createAccount();

      tick(1000);
      fixture.detectChanges();

      expect(spinnerServiceSpy.show).toHaveBeenCalled();

      expect(accountServiceSpy.createAccount).toHaveBeenCalledWith({
        type: 'Checking',
        customerId: 101,
        balance: 500
      });

      expect(component.accountCreated.emit).toHaveBeenCalled();
      expect(component.closeModal.emit).toHaveBeenCalled();

      expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    }));

    it('should handle error and hide spinner on failure', async () => {
      const errorResponse = new Error('Account creation failed');
      accountServiceSpy.createAccount.and.returnValue(throwError(() => errorResponse));

      spyOn(console, 'error');

      component.createAccount();

      await fixture.whenStable();

      expect(spinnerServiceSpy.show).toHaveBeenCalled();

      expect(spinnerServiceSpy.hide).toHaveBeenCalled();

      expect(console.error).toHaveBeenCalledWith('Error creating account:', errorResponse);
    });
  });
});
