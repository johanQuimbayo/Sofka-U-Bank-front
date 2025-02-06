import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';
import { AccountService } from 'src/app/services/account/account.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;


  const mockAccounts: AccountResponse[] = [
    {
      id: 1,
      type: 'Savings',
      customerId: 101,
      balance: 1500,
      accountNumber: 123456
    },
    {
      id: 2,
      type: 'Checking',
      customerId: 102,
      balance: 2500,
      accountNumber: 654321
    }
  ];

  beforeEach(async () => {
    const accountSpy = jasmine.createSpyObj('AccountService', ['getAccounts']);
    const authSpy = jasmine.createSpyObj('AuthService', [
      'getUserId',
      'getUserName',
      'getDocumentNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: AccountService, useValue: accountSpy },
        { provide: AuthService, useValue: authSpy }
      ],
      imports: [RouterTestingModule]
    }).compileComponents();

    accountServiceSpy = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  /*** Pruebas Unitarias ***/
  describe('Unit tests', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should call loadAccounts on ngOnInit', () => {
      spyOn(component, 'loadAccounts');
      component.ngOnInit();
      expect(component.loadAccounts).toHaveBeenCalled();
    });

    it('should load accounts when userId is not null', () => {
      authServiceSpy.getUserId.and.returnValue(1);
      accountServiceSpy.getAccounts.and.returnValue(of(mockAccounts));

      component.loadAccounts();

      expect(authServiceSpy.getUserId).toHaveBeenCalled();
      expect(accountServiceSpy.getAccounts).toHaveBeenCalledWith(1);
      expect(component.accounts).toEqual(mockAccounts);
    });

    it('should log error when userId is null', () => {
      spyOn(console, 'error');
      authServiceSpy.getUserId.and.returnValue(null);

      component.loadAccounts();

      expect(console.error).toHaveBeenCalledWith('Error: No se pudo obtener el ID del usuario.');
    });

    it('should open and close create account modal', () => {
      component.openCreateAccountModal();
      expect(component.showCreateAccountModal).toBeTrue();

      component.closeCreateAccountModal();
      expect(component.showCreateAccountModal).toBeFalse();
    });

    it('should return user info from authService', () => {
      authServiceSpy.getUserId.and.returnValue(1);
      authServiceSpy.getUserName.and.returnValue('TestUser');
      authServiceSpy.getDocumentNumber.and.returnValue('123456789');

      expect(component.getUserId()).toEqual(1);
      expect(component.getUserName()).toEqual('TestUser');
      expect(component.getUserDocumentNumber()).toEqual('123456789');
    });
  });

  /*** Pruebas de Integración ***/
  describe('Integration tests', () => {
    beforeEach(() => {
      authServiceSpy.getUserId.and.returnValue(1);
      accountServiceSpy.getAccounts.and.returnValue(of(mockAccounts));

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render a list of accounts in the template', () => {
      const accountRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(accountRows.length).toEqual(mockAccounts.length);

      const firstRow = accountRows[0].nativeElement;
      expect(firstRow.textContent).toContain(`${mockAccounts[0].accountNumber}`);
    });

    it('should display a placeholder when there are no accounts', () => {
      authServiceSpy.getUserId.and.returnValue(1);
      accountServiceSpy.getAccounts.and.returnValue(of([]));

      component.loadAccounts();
      fixture.detectChanges();

      const placeholder = fixture.debugElement.query(By.css('section.overview p'));
      expect(placeholder).toBeTruthy();
      expect(placeholder.nativeElement.textContent).toContain('No hay cuentas disponibles.');
    });
  });
});
