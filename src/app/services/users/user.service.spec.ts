import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserRequest } from 'src/app/models/users/request/user.request.interface';
import { UserResponse } from 'src/app/models/users/response/user.response.interface';
import { SpinnerService } from 'src/app/utils/load-spinner/service/spinner.service';
import { environment } from 'src/environments/environments';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;

  const mockUserRequest: UserRequest = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    documentNumber: '1234567890',
    password: 'password123'
  };

  const mockUserResponse: UserResponse = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    documentNumber: '1234567890',
    password: 'password123'
  };

  beforeEach(() => {
    const spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: SpinnerService, useValue: spinnerSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    spinnerServiceSpy = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('#register', () => {
    it('should send a POST request to register a user and handle response correctly', () => {

      service.register(mockUserRequest).subscribe(response => {
        expect(response).toEqual(mockUserResponse);
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUserRequest);

      req.flush(mockUserResponse);

      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    });


    it('should call spinnerService.hide even if the request fails', () => {

      service.register(mockUserRequest).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth`);
      req.error(new ErrorEvent('Network error'));

      expect(spinnerServiceSpy.show).toHaveBeenCalled();
      expect(spinnerServiceSpy.hide).toHaveBeenCalled();
      });
    });
});
