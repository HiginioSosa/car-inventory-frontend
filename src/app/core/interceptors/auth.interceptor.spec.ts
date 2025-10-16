import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let localStorageSpy: jasmine.Spy;

  beforeEach(() => {
    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', (done) => {
    const mockToken = 'test-jwt-token';
    localStorageSpy.and.returnValue(mockToken);

    httpClient.get('/api/test').subscribe({
      next: () => {
        done();
      },
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should not add Authorization header when token does not exist', (done) => {
    localStorageSpy.and.returnValue(null);

    httpClient.get('/api/test').subscribe({
      next: () => {
        done();
      },
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should retrieve token from localStorage with correct key', (done) => {
    localStorageSpy.and.returnValue('some-token');

    httpClient.get('/api/test').subscribe({
      next: () => {
        expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
        done();
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({});
  });

  it('should handle POST requests with token', (done) => {
    const mockToken = 'post-test-token';
    localStorageSpy.and.returnValue(mockToken);

    httpClient.post('/api/cars', { name: 'Test Car' }).subscribe({
      next: () => {
        done();
      },
    });

    const req = httpMock.expectOne('/api/cars');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should handle PUT requests with token', (done) => {
    const mockToken = 'put-test-token';
    localStorageSpy.and.returnValue(mockToken);

    httpClient.put('/api/cars/123', { name: 'Updated Car' }).subscribe({
      next: () => {
        done();
      },
    });

    const req = httpMock.expectOne('/api/cars/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should handle DELETE requests with token', (done) => {
    const mockToken = 'delete-test-token';
    localStorageSpy.and.returnValue(mockToken);

    httpClient.delete('/api/cars/123').subscribe({
      next: () => {
        done();
      },
    });

    const req = httpMock.expectOne('/api/cars/123');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should not modify existing headers', (done) => {
    const mockToken = 'test-token';
    localStorageSpy.and.returnValue(mockToken);

    httpClient
      .get('/api/test', {
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value',
        },
      })
      .subscribe({
        next: () => {
          done();
        },
      });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('X-Custom-Header')).toBe('custom-value');
    req.flush({});
  });

  it('should handle empty token string as no token', (done) => {
    localStorageSpy.and.returnValue('');

    httpClient.get('/api/test').subscribe({
      next: () => {
        done();
      },
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should clone request when adding token', (done) => {
    const mockToken = 'clone-test-token';
    localStorageSpy.and.returnValue(mockToken);

    httpClient.get('/api/test', { headers: { 'X-Original': 'value' } }).subscribe({
      next: () => {
        done();
      },
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.headers.get('X-Original')).toBe('value');
    req.flush({});
  });

  it('should work with multiple concurrent requests', (done) => {
    const mockToken = 'concurrent-token';
    localStorageSpy.and.returnValue(mockToken);

    let completedRequests = 0;
    const totalRequests = 3;

    const checkDone = () => {
      completedRequests++;
      if (completedRequests === totalRequests) {
        done();
      }
    };

    httpClient.get('/api/test1').subscribe({ next: checkDone });
    httpClient.get('/api/test2').subscribe({ next: checkDone });
    httpClient.get('/api/test3').subscribe({ next: checkDone });

    const req1 = httpMock.expectOne('/api/test1');
    const req2 = httpMock.expectOne('/api/test2');
    const req3 = httpMock.expectOne('/api/test3');

    expect(req1.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req3.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req1.flush({});
    req2.flush({});
    req3.flush({});
  });
});
