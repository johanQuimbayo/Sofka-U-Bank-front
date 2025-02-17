import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from 'src/app/services/account/account.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SpinnerService } from 'src/app/utils/load-spinner/service/spinner.service';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;

  let router: Router;

  const mockAccounts: AccountResponse[] = [
    { id: 1, type: 'Savings', customerId: 101, balance: 1500, accountNumber: 123456 },
    { id: 2, type: 'Checking', customerId: 102, balance: 2500, accountNumber: 654321 }
  ];

  beforeEach(async () => {
    const accountSpy = jasmine.createSpyObj('AccountService', ['getAccounts']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUserId', 'logout']);
    const spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: AccountService, useValue: accountSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: SpinnerService, useValue: spinnerSpy }
      ],
      imports: [RouterTestingModule]
    }).compileComponents();

    router = TestBed.inject(Router); 
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    accountServiceSpy = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spinnerServiceSpy = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;

    fixture = TestBed.createComponent(HomeComponent);
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

    it('should log out the user', () => {
      spyOn(component, 'logOut').and.callThrough();

      component.logOut();
      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
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

    it('should render sidebar with navigation links', () => {
      const sidebar = fixture.debugElement.query(By.css('.sidebar'));
      expect(sidebar).toBeTruthy();
      expect(sidebar.nativeElement.textContent).toContain('Inicio');
      expect(sidebar.nativeElement.textContent).toContain('Perfil');
      expect(sidebar.nativeElement.textContent).toContain('Historial de eventos');
      expect(sidebar.nativeElement.textContent).toContain('Cerrar Sesión');
    });

    it('should navigate to login when clicking on logout', fakeAsync(() => {
      spyOn(component, 'logOut').and.callThrough();

      component.logOut();
      expect(component.logOut).toHaveBeenCalled();
      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });
});
