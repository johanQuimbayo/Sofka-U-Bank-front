import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthRequest } from 'src/app/models/auth/request/auth.request.interface';
import { AuthResponse } from 'src/app/models/auth/response/auth.response.interface';
import { SpinnerService } from 'src/app/utils/load-spinner/service/spinner.service';
import { environment } from 'src/environments/environments';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;

  // Se definen datos de prueba para auth
  const mockAuthRequest: AuthRequest = {
    email: 'test@test.com',
    pass: 'password123'
  };

  const mockAuthResponse: AuthResponse = {
    token: 'header.' + btoa(JSON.stringify({ userId: 123 })) + '.signature',
    email: 'test@test.com',
    userId: 123,
    userName: 'Test User',
    documentNumber: '123456789'
  };

  beforeEach(() => {
    // Se crea un spy para SpinnerService
    const spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: SpinnerService, useValue: spinnerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    spinnerServiceSpy = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;

    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    // Verificar que no existan peticiones pendientes
    httpTestingController.verify();
    localStorage.clear();
  });

  describe('#auth', () => {
    it('should call spinnerService.show before and spinnerService.hide after the HTTP request, and set localStorage if token exists', () => {
      service.auth(mockAuthRequest).subscribe((response) => {
        // Verificar la respuesta
        expect(response).toEqual(mockAuthResponse);
        // Verificar que se hayan guardado token, userName y documentNumber en localStorage
        expect(localStorage.getItem('token')).toEqual(mockAuthResponse.token);
        expect(localStorage.getItem('userName')).toEqual(mockAuthResponse.userName);
        expect(localStorage.getItem('documentNumber')).toEqual(mockAuthResponse.documentNumber);
      });

      // Verificar que spinnerService.show() se haya llamado antes de la petición
      expect(spinnerServiceSpy.show).toHaveBeenCalled();

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockAuthRequest);

      // Simular la respuesta del backend
      req.flush(mockAuthResponse);

      // spinnerService.hide() se invoca en finalize, por lo que esperamos que se haya llamado luego de la respuesta
      expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    });
  });

  describe('#getUserId', () => {
    it('should return the userId if token exists and is valid', () => {
      // Creamos un token dummy con payload que contiene userId: 123
      const token = 'header.' + btoa(JSON.stringify({ userId: 123 })) + '.signature';
      localStorage.setItem('token', token);

      const userId = service.getUserId();
      expect(userId).toEqual(123);
    });

    it('should return null if token does not exist', () => {
      localStorage.removeItem('token');
      const userId = service.getUserId();
      expect(userId).toBeNull();
    });

    it('should return null if token is invalid', () => {
      // Almacenar un token inválido
      localStorage.setItem('token', 'invalid.token.value');
      const userId = service.getUserId();
      expect(userId).toBeNull();
    });
  });

  describe('#logout', () => {
    it('should remove token, userName and documentNumber from localStorage', () => {
      // Pre-cargar valores en localStorage
      localStorage.setItem('token', 'dummyToken');
      localStorage.setItem('userName', 'dummyUser');
      localStorage.setItem('documentNumber', 'dummyDocument');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userName')).toBeNull();
      expect(localStorage.getItem('documentNumber')).toBeNull();
    });
  });

  describe('Getter methods', () => {
    it('#getToken, #getUserName, #getDocumentNumber should return corresponding values from localStorage', () => {
      localStorage.setItem('token', 'dummyToken');
      localStorage.setItem('userName', 'dummyUser');
      localStorage.setItem('documentNumber', 'dummyDocument');

      expect(service.getToken()).toEqual('dummyToken');
      expect(service.getUserName()).toEqual('dummyUser');
      expect(service.getDocumentNumber()).toEqual('dummyDocument');
    });

    it('should return null for getToken, getUserName, getDocumentNumber if they do not exist', () => {
      localStorage.clear();

      expect(service.getToken()).toBeNull();
      expect(service.getUserName()).toBeNull();
      expect(service.getDocumentNumber()).toBeNull();
    });
  });
});
