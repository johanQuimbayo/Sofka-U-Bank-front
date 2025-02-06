import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserResponse } from 'src/app/models/users/response/user.response.interface';
import { UserService } from 'src/app/services/users/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let router: Router;

  // Simulamos una respuesta de registro exitosa
  const mockUserResponse: UserResponse = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    documentNumber: '1234567890',
    password: '12345678'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['register']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Unit tests', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should create a form with name, email, documentNumber and password fields', () => {
      expect(component.registerForm.contains('name')).toBeTrue();
      expect(component.registerForm.contains('email')).toBeTrue();
      expect(component.registerForm.contains('documentNumber')).toBeTrue();
      expect(component.registerForm.contains('password')).toBeTrue();
    });

    it('should validate the name field as required and with a minimum length of 3', () => {
      const nameControl = component.registerForm.get('name');
      if (nameControl) {
        nameControl.setValue('');
        expect(nameControl.valid).toBeFalse();
        nameControl.setValue('ab');
        expect(nameControl.valid).toBeFalse();
        nameControl.setValue('abc');
        expect(nameControl.valid).toBeTrue();
      }
    });

    it('should validate the email field as required and with valid email format', () => {
      const emailControl = component.registerForm.get('email');
      if (emailControl) {
        emailControl.setValue('');
        expect(emailControl.valid).toBeFalse();
        emailControl.setValue('invalidEmail');
        expect(emailControl.valid).toBeFalse();
        emailControl.setValue('test@test.com');
        expect(emailControl.valid).toBeTrue();
      }
    });

    it('should validate the documentNumber field as required and with a minimum length of 10', () => {
      const documentControl = component.registerForm.get('documentNumber');
      if (documentControl) {
        documentControl.setValue('');
        expect(documentControl.valid).toBeFalse();
        documentControl.setValue('123456789'); // 9 dígitos, inválido
        expect(documentControl.valid).toBeFalse();
        documentControl.setValue('1234567890'); // 10 dígitos, válido
        expect(documentControl.valid).toBeTrue();
      }
    });

    it('should validate the password field as required and with a minimum length of 8', () => {
      const passwordControl = component.registerForm.get('password');
      if (passwordControl) {
        passwordControl.setValue('');
        expect(passwordControl.valid).toBeFalse();
        passwordControl.setValue('1234567'); // 7 caracteres, inválido
        expect(passwordControl.valid).toBeFalse();
        passwordControl.setValue('12345678');
        expect(passwordControl.valid).toBeTrue();
      }
    });

    it('should call userService.register and navigate when form is valid', () => {
      // Asignamos valores válidos al formulario
      component.registerForm.setValue({
        name: 'Test User',
        email: 'test@test.com',
        documentNumber: '1234567890',
        password: '12345678'
      });

      // Configuramos el spy para que retorne la respuesta simulada
      userServiceSpy.register.and.returnValue(of(mockUserResponse));

      // Ejecutamos el método register
      component.register();

      // Verificamos que se haya llamado al método register del servicio con los datos correctos
      expect(userServiceSpy.register).toHaveBeenCalledOnceWith({
        name: 'Test User',
        email: 'test@test.com',
        documentNumber: '1234567890',
        password: '12345678'
      });
      // Verificamos que se haya llamado al router para navegar a la ruta '/auth'
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });

    it('should not call userService.register and log "form invalid" when form is invalid', () => {
      // Asignamos valores inválidos al formulario
      component.registerForm.setValue({
        name: '',
        email: '',
        documentNumber: '',
        password: ''
      });
      const consoleSpy = spyOn(console, 'log');

      component.register();

      expect(consoleSpy).toHaveBeenCalledWith('form invalid');
      expect(userServiceSpy.register).not.toHaveBeenCalled();
    });

    it('should handle error if registration fails', () => {
      // Asignamos valores válidos al formulario
      component.registerForm.setValue({
        name: 'Test User',
        email: 'test@test.com',
        documentNumber: '1234567890',
        password: '12345678'
      });
      // Configuramos el spy para simular un error
      userServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));
      const consoleSpy = spyOn(console, 'log');

      component.register();

      expect(consoleSpy).toHaveBeenCalledWith('Register failed');
    });
  });
});
