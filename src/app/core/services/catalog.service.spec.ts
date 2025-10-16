import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CatalogService } from './catalog.service';
import { environment } from '@environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { Catalog } from '@core/models';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpMock: HttpTestingController;

  const mockCatalog: Catalog = {
    _id: '123',
    marca: 'Toyota',
    modelos: [
      { nombre: 'Corolla', isActive: true },
      { nombre: 'Camry', isActive: true },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBrands', () => {
    it('should fetch all brands', (done) => {
      const mockResponse = {
        status: 200,
        message: 'Brands fetched',
        data: {
          marcas: ['Toyota', 'Honda', 'Ford'],
        },
      };

      service.getBrands().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(response.data.marcas.length).toBe(3);
          expect(response.data.marcas).toContain('Toyota');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/brands`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty brands list', (done) => {
      const mockResponse = {
        status: 200,
        message: 'No brands found',
        data: {
          marcas: [],
        },
      };

      service.getBrands().subscribe({
        next: (response) => {
          expect(response.data.marcas.length).toBe(0);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/brands`);
      req.flush(mockResponse);
    });
  });

  describe('getModels', () => {
    it('should fetch models for a specific brand', (done) => {
      const marca = 'Toyota';
      const mockResponse = {
        status: 200,
        message: 'Models fetched',
        data: {
          marca: 'Toyota',
          modelos: ['Corolla', 'Camry', 'RAV4'],
        },
      };

      service.getModels(marca).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(response.data.marca).toBe('Toyota');
          expect(response.data.modelos.length).toBe(3);
          expect(response.data.modelos).toContain('Corolla');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/models/${marca}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle brand with no models', (done) => {
      const marca = 'UnknownBrand';
      const mockResponse = {
        status: 200,
        message: 'No models found',
        data: {
          marca: 'UnknownBrand',
          modelos: [],
        },
      };

      service.getModels(marca).subscribe({
        next: (response) => {
          expect(response.data.modelos.length).toBe(0);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/models/${marca}`);
      req.flush(mockResponse);
    });

    it('should handle special characters in brand name', (done) => {
      const marca = 'Alfa Romeo';
      const encodedMarca = 'Alfa%20Romeo';
      const mockResponse = {
        status: 200,
        message: 'Models fetched',
        data: {
          marca: 'Alfa Romeo',
          modelos: ['Giulia', 'Stelvio'],
        },
      };

      service.getModels(marca).subscribe({
        next: (response) => {
          expect(response.data.marca).toBe('Alfa Romeo');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/models/${marca}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getYears', () => {
    it('should fetch available years', (done) => {
      const mockResponse = {
        status: 200,
        message: 'Years fetched',
        data: {
          anios: [2020, 2021, 2022, 2023, 2024],
        },
      };

      service.getYears().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(response.data.anios.length).toBe(5);
          expect(response.data.anios).toContain(2024);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/years`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getCatalogs', () => {
    it('should fetch all catalogs', (done) => {
      const mockResponse = {
        status: 200,
        message: 'Catalogs fetched',
        data: {
          catalogs: [mockCatalog],
        },
      };

      service.getCatalogs().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(response.data.catalogs.length).toBe(1);
          expect(response.data.catalogs[0].marca).toBe('Toyota');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty catalogs', (done) => {
      const mockResponse = {
        status: 200,
        message: 'No catalogs',
        data: {
          catalogs: [],
        },
      };

      service.getCatalogs().subscribe({
        next: (response) => {
          expect(response.data.catalogs.length).toBe(0);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs`);
      req.flush(mockResponse);
    });
  });

  describe('initializeCatalogs', () => {
    it('should initialize catalogs', (done) => {
      const mockResponse = {
        status: 200,
        message: 'Catalogs initialized successfully',
        data: {
          message: 'Catalogs have been seeded',
        },
      };

      service.initializeCatalogs().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(response.data.message).toBe('Catalogs have been seeded');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/initialize`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });

    it('should handle initialization errors', (done) => {
      service.initializeCatalogs().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/catalogs/initialize`);
      req.flush(
        { message: 'Initialization failed' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });
});
