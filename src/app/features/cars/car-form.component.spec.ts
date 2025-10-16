import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CarFormComponent } from './car-form.component';
import { CarsService, CatalogService } from '@core/services';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';

describe('CarFormComponent', () => {
  let component: CarFormComponent;
  let fixture: ComponentFixture<CarFormComponent>;
  let carsService: jasmine.SpyObj<CarsService>;
  let catalogService: jasmine.SpyObj<CatalogService>;
  let router: Router;

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
    const carsServiceSpy = jasmine.createSpyObj('CarsService', ['getCar', 'createCar', 'updateCar']);
    const catalogServiceSpy = jasmine.createSpyObj('CatalogService', [
      'getBrands',
      'getModels',
      'getYears',
    ]);

    await TestBed.configureTestingModule({
      imports: [CarFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'cars', component: DummyComponent },
          { path: 'cars/new', component: CarFormComponent },
          { path: 'cars/:id/edit', component: CarFormComponent },
        ]),
        { provide: CarsService, useValue: carsServiceSpy },
        { provide: CatalogService, useValue: catalogServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: convertToParamMap({}) },
          },
        },
      ],
    }).compileComponents();

    carsService = TestBed.inject(CarsService) as jasmine.SpyObj<CarsService>;
    catalogService = TestBed.inject(CatalogService) as jasmine.SpyObj<CatalogService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    catalogService.getBrands.and.returnValue(of(mockBrandsResponse));
    catalogService.getYears.and.returnValue(of(mockYearsResponse));

    fixture = TestBed.createComponent(CarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load catalogs on init', () => {
    expect(catalogService.getBrands).toHaveBeenCalled();
    expect(catalogService.getYears).toHaveBeenCalled();
  });

  it('should initialize with empty form', () => {
    expect(component['carForm'].get('marca')?.value).toBe('');
  });

  it('should have invalid form when empty', () => {
    expect(component['carForm'].valid).toBeFalsy();
  });
});
