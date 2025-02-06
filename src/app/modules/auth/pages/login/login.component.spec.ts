import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthResponse } from 'src/app/models/auth/response/auth.response.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;

  let router: Router;

  const mockAuthResponse: AuthResponse = {
    token: 'fakeToken',
    email: 'test@test.com',
    userId: 1,
    userName: 'Test User',
    documentNumber: '123456789'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['auth']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ],
      imports: [ReactiveFormsModule, RouterTestingModule]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  /*** Pruebas Unitarias ***/
  describe('Unit tests', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should create a form with email and pass fields', () => {
      expect(component.loginForm.contains('email')).toBeTrue();
      expect(component.loginForm.contains('pass')).toBeTrue();
    });

    it('should make the email field required and email valid', () => {
      const email = component.loginForm.get('email');
      if (email) {
        email.setValue('');
        expect(email.valid).toBeFalse();
        email.setValue('test@test.com');
        expect(email.valid).toBeTrue();
      }
    });

    it('should make the pass field required and minLength valid', () => {
      const pass = component.loginForm.get('pass');
      if(pass) {
        pass.setValue('');
        expect(pass.valid).toBeFalse();
        pass.setValue('12345678');
        expect(pass.valid).toBeTrue();
      }
    });

    it('should call authService.auth and navigate when form is valid', () => {
      component.loginForm.setValue({ email: 'test@test.com', pass: 'password123' });

      // Configurar el spy para que retorne la respuesta simulada
      authServiceSpy.auth.and.returnValue(of(mockAuthResponse));

      // Llamar a la función auth
      component.auth();

      // Verificar que se haya llamado al servicio con los argumentos esperados
      expect(authServiceSpy.auth).toHaveBeenCalledOnceWith({ email: 'test@test.com', pass: 'password123' });

      // Verificar que se haya navegado a la ruta '/home'
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should not call authService.auth and log form invalid if form is invalid', () => {
      component.loginForm.setValue({ email: '', pass: '' });
      const spy = spyOn(console, 'log');

      component.auth();

      expect(spy).toHaveBeenCalledWith('form invalid');
      expect(authServiceSpy.auth).not.toHaveBeenCalled();
    });

    it('should handle error if authentication fails', () => {
      component.loginForm.setValue({ email: 'test@test.com', pass: 'password123' });
      authServiceSpy.auth.and.returnValue(throwError(() => new Error('Authentication failed')));
      const spy = spyOn(console, 'log');

      component.auth();

      expect(spy).toHaveBeenCalledWith('Authentication failed');
    });
  });

  /*** Pruebas de Integración ***/
  describe('Integration tests', () => {
    beforeEach(() => {
      authServiceSpy.auth.and.returnValue(of(mockAuthResponse));
      component.loginForm.setValue({ email: 'test@test.com', pass: 'password123' });
      fixture.detectChanges();
    });

    it('should navigate to home after successful authentication', () => {
      component.auth();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should render error message if authentication fails', () => {
      authServiceSpy.auth.and.returnValue(throwError(() => new Error('Authentication failed')));
      const spy = spyOn(console, 'log');

      component.auth();

      expect(spy).toHaveBeenCalledWith('Authentication failed');
    });
  });
});
