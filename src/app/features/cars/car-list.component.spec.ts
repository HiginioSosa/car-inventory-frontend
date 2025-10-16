import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CarListComponent } from './car-list.component';
import { CarsService, CatalogService } from '@core/services';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';

describe('CarListComponent', () => {
  let component: CarListComponent;
  let fixture: ComponentFixture<CarListComponent>;
  let carsService: jasmine.SpyObj<CarsService>;
  let catalogService: jasmine.SpyObj<CatalogService>;
  let router: Router;

  const mockPaginatedResponse = {
    status: 200,
    message: 'Cars fetched',
    data: {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    },
  };

  const mockBrandsResponse = {
    status: 200,
    message: 'Brands fetched',
    data: { marcas: ['Toyota', 'Honda'] },
  };

  const mockYearsResponse = {
    status: 200,
    message: 'Years fetched',
    data: { anios: [2020, 2021, 2022] },
  };

  @Component({ template: '', standalone: true })
  class DummyComponent {}

  beforeEach(async () => {
    const carsServiceSpy = jasmine.createSpyObj('CarsService', ['getCars', 'deleteCar']);
    const catalogServiceSpy = jasmine.createSpyObj('CatalogService', [
      'getBrands',
      'getModels',
      'getYears',
    ]);

    await TestBed.configureTestingModule({
      imports: [CarListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'cars', component: CarListComponent },
          { path: 'cars/new', component: DummyComponent },
          { path: 'cars/:id/edit', component: DummyComponent },
        ]),
        { provide: CarsService, useValue: carsServiceSpy },
        { provide: CatalogService, useValue: catalogServiceSpy },
      ],
    }).compileComponents();

    carsService = TestBed.inject(CarsService) as jasmine.SpyObj<CarsService>;
    catalogService = TestBed.inject(CatalogService) as jasmine.SpyObj<CatalogService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    carsService.getCars.and.returnValue(of(mockPaginatedResponse));
    catalogService.getBrands.and.returnValue(of(mockBrandsResponse));
    catalogService.getYears.and.returnValue(of(mockYearsResponse));

    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cars on init', () => {
    expect(carsService.getCars).toHaveBeenCalled();
  });

  it('should load catalogs on init', () => {
    expect(catalogService.getBrands).toHaveBeenCalled();
    expect(catalogService.getYears).toHaveBeenCalled();
  });

  it('should initialize with empty cars array', () => {
    expect(component['cars']()).toEqual([]);
  });

  it('should have empty cars signal initially', () => {
    expect(component['cars']()).toEqual([]);
  });
});
