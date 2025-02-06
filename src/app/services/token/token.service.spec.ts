import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService]
    });
    service = TestBed.inject(TokenService);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('#getToken', () => {
    it('should return the token if it exists in localStorage', () => {
      const mockToken = 'dummyToken';
      localStorage.setItem('token', mockToken);

      const token = service.getToken();
      expect(token).toEqual(mockToken);
    });

    it('should return null if token does not exist in localStorage', () => {
      const token = service.getToken();
      expect(token).toBeNull();
    });
  });

  describe('#deleteToken', () => {
    it('should remove the token from localStorage', () => {
      localStorage.setItem('token', 'dummyToken');
      service.deleteToken();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
