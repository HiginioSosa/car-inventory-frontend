import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CarsService } from './cars.service';
import { environment } from '@environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { Car, CarFilters, CarStats } from '@core/models';

describe('CarsService', () => {
  let service: CarsService;
  let httpMock: HttpTestingController;

  const mockCar: Car = {
    _id: '123',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2022,
    precio: 25000,
    kilometraje: 15000,
    color: 'Rojo',
    email: 'seller@example.com',
    telefono: '1234567890',
    foto: 'https://example.com/car.jpg',
    fechaAlta: '2024-01-01T00:00:00.000Z',
    fechaModificacion: '2024-01-01T00:00:00.000Z',
    fechaEliminacion: null,
    isDeleted: false,
  };

  const mockPaginatedResponse = {
    status: 200,
    message: 'Cars fetched successfully',
    data: {
      data: [mockCar],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    },
  };

  const mockCarResponse = {
    status: 200,
    message: 'Car fetched successfully',
    data: mockCar,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CarsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCars', () => {
    it('should fetch cars without filters', (done) => {
      service.getCars().subscribe({
        next: (response) => {
          expect(response).toEqual(mockPaginatedResponse);
          expect(response.data.data.length).toBe(1);
          expect(response.data.data[0]).toEqual(mockCar);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockPaginatedResponse);
    });

    it('should fetch cars with filters', (done) => {
      const filters: CarFilters = {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2022,
        minPrecio: 20000,
        maxPrecio: 30000,
        color: 'Rojo',
        page: 1,
        limit: 10,
        sortBy: 'precio',
        sortOrder: 'asc',
      };

      service.getCars(filters).subscribe({
        next: (response) => {
          expect(response).toEqual(mockPaginatedResponse);
          done();
        },
      });

      const req = httpMock.expectOne((request) => {
        return request.url === `${environment.apiUrl}/cars` && request.params.has('marca');
      });

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('marca')).toBe('Toyota');
      expect(req.request.params.get('modelo')).toBe('Corolla');
      expect(req.request.params.get('anio')).toBe('2022');
      expect(req.request.params.get('minPrecio')).toBe('20000');
      expect(req.request.params.get('maxPrecio')).toBe('30000');
      expect(req.request.params.get('color')).toBe('Rojo');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('10');
      expect(req.request.params.get('sortBy')).toBe('precio');
      expect(req.request.params.get('sortOrder')).toBe('asc');

      req.flush(mockPaginatedResponse);
    });

    it('should ignore null, undefined, and empty string filters', (done) => {
      const filters: CarFilters = {
        marca: 'Toyota',
        modelo: undefined,
        anio: null as any,
        color: '',
      };

      service.getCars(filters).subscribe({
        next: () => {
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars?marca=Toyota`);
      expect(req.request.params.has('marca')).toBe(true);
      expect(req.request.params.has('modelo')).toBe(false);
      expect(req.request.params.has('anio')).toBe(false);
      expect(req.request.params.has('color')).toBe(false);

      req.flush(mockPaginatedResponse);
    });
  });

  describe('getCar', () => {
    it('should fetch a single car by id', (done) => {
      const carId = '123';

      service.getCar(carId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockCarResponse);
          expect(response.data).toEqual(mockCar);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars/${carId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCarResponse);
    });

    it('should handle 404 error for non-existent car', (done) => {
      const carId = 'non-existent';

      service.getCar(carId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars/${carId}`);
      req.flush({ message: 'Car not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createCar', () => {
    it('should create a car with FormData', (done) => {
      const carData = {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2022,
        precio: 25000,
        kilometraje: 15000,
        color: 'Rojo',
        email: 'seller@example.com',
        telefono: '1234567890',
      };

      service.createCar(carData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockCarResponse);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);

      const formData = req.request.body as FormData;
      expect(formData.get('marca')).toBe('Toyota');
      expect(formData.get('modelo')).toBe('Corolla');
      expect(formData.get('anio')).toBe('2022');
      expect(formData.get('precio')).toBe('25000');

      req.flush(mockCarResponse);
    });

    it('should create a car with photo file', (done) => {
      const mockFile = new File(['photo content'], 'car.jpg', { type: 'image/jpeg' });
      const carData = {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2022,
        precio: 25000,
        kilometraje: 15000,
        email: 'seller@example.com',
        telefono: '1234567890',
        foto: mockFile,
      };

      service.createCar(carData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockCarResponse);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars`);
      const formData = req.request.body as FormData;
      expect(formData.get('foto')).toBe(mockFile);

      req.flush(mockCarResponse);
    });
  });

  describe('updateCar', () => {
    it('should update a car', (done) => {
      const carId = '123';
      const updateData = {
        precio: 26000,
        kilometraje: 16000,
      };

      service.updateCar(carId, updateData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockCarResponse);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars/${carId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body instanceof FormData).toBe(true);

      const formData = req.request.body as FormData;
      expect(formData.get('precio')).toBe('26000');
      expect(formData.get('kilometraje')).toBe('16000');

      req.flush(mockCarResponse);
    });

    it('should handle null and undefined values in update', (done) => {
      const carId = '123';
      const updateData = {
        precio: 26000,
        color: undefined,
        telefono: null as any,
      };

      service.updateCar(carId, updateData).subscribe({
        next: () => {
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars/${carId}`);
      const formData = req.request.body as FormData;
      expect(formData.get('precio')).toBe('26000');
      expect(formData.has('color')).toBe(false);
      expect(formData.has('telefono')).toBe(false);

      req.flush(mockCarResponse);
    });
  });

  describe('deleteCar', () => {
    it('should delete a car (soft delete)', (done) => {
      const carId = '123';
      const deleteResponse = {
        status: 200,
        message: 'Car deleted successfully',
        data: {
          id: carId,
          fechaEliminacion: '2024-01-02T00:00:00.000Z',
        },
      };

      service.deleteCar(carId).subscribe({
        next: (response) => {
          expect(response).toEqual(deleteResponse);
          expect(response.data.id).toBe(carId);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars/${carId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(deleteResponse);
    });
  });

  describe('searchCars', () => {
    it('should search cars by query', (done) => {
      const query = 'Toyota';
      const searchResponse = {
        status: 200,
        message: 'Search results',
        data: [mockCar],
      };

      service.searchCars(query).subscribe({
        next: (response) => {
          expect(response).toEqual(searchResponse);
          expect(response.data.length).toBe(1);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars/search?q=Toyota`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('q')).toBe('Toyota');
      req.flush(searchResponse);
    });
  });

  describe('getStats', () => {
    it('should fetch car statistics', (done) => {
      const mockStats: CarStats = {
        total: 100,
        deleted: 10,
        active: 90,
        averagePrice: 25000,
        averageKm: 15000,
      };

      const statsResponse = {
        status: 200,
        message: 'Stats fetched',
        data: mockStats,
      };

      service.getStats().subscribe({
        next: (response) => {
          expect(response).toEqual(statsResponse);
          expect(response.data.total).toBe(100);
          expect(response.data.active).toBe(90);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars/stats`);
      expect(req.request.method).toBe('GET');
      req.flush(statsResponse);
    });
  });

  describe('buildFormData (private method testing via public methods)', () => {
    it('should exclude undefined and null values', (done) => {
      const carData = {
        marca: 'Toyota',
        modelo: undefined as any,
        anio: 2022,
        precio: null as any,
        kilometraje: 15000,
        email: 'test@example.com',
        telefono: '1234567890',
      };

      service.createCar(carData).subscribe({
        next: () => {
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars`);
      const formData = req.request.body as FormData;

      expect(formData.has('marca')).toBe(true);
      expect(formData.has('modelo')).toBe(false);
      expect(formData.has('anio')).toBe(true);
      expect(formData.has('precio')).toBe(false);
      expect(formData.has('kilometraje')).toBe(true);

      req.flush(mockCarResponse);
    });

    it('should handle File objects correctly', (done) => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const carData = {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2022,
        precio: 25000,
        kilometraje: 15000,
        email: 'test@example.com',
        telefono: '1234567890',
        foto: mockFile,
      };

      service.createCar(carData).subscribe({
        next: () => {
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cars`);
      const formData = req.request.body as FormData;

      expect(formData.get('foto')).toEqual(mockFile);
      expect(formData.get('foto') instanceof File).toBe(true);

      req.flush(mockCarResponse);
    });
  });
});
