import {
  Component,
  signal,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { CarsService, CatalogService } from '../../core/services';
import { Car, CarFilters, Pagination } from '../../core/models';

@Component({
  selector: 'app-car-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './car-list.component.html',
})
export class CarListComponent implements OnInit {
  private readonly carsService = inject(CarsService);
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  protected readonly cars = signal<Car[]>([]);
  protected readonly pagination = signal<Pagination | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly brands = signal<string[]>([]);
  protected readonly models = signal<string[]>([]);
  protected readonly years = signal<number[]>([]);

  protected readonly filterForm = new FormGroup({
    marca: new FormControl(''),
    modelo: new FormControl(''),
    anio: new FormControl(''),
    minPrecio: new FormControl(''),
    maxPrecio: new FormControl(''),
    color: new FormControl(''),
    page: new FormControl(1),
    limit: new FormControl(10),
  });

  protected readonly showFilters = signal(false);
  protected readonly selectedCar = signal<Car | null>(null);
  protected readonly showDeleteModal = signal(false);
  protected readonly showViewModal = signal(false);
  protected readonly Math = Math;

  protected readonly hasFilters = computed(() => {
    const values = this.filterForm.value;
    return !!(
      values.marca ||
      values.modelo ||
      values.anio ||
      values.minPrecio ||
      values.maxPrecio ||
      values.color
    );
  });

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadCars();
    this.setupFilterListeners();
  }

  private loadCatalogs(): void {
    this.catalogService.getBrands().subscribe({
      next: (response) => {
        this.brands.set(response.data.marcas);
      },
    });

    this.catalogService.getYears().subscribe({
      next: (response) => {
        this.years.set(response.data.anios);
      },
    });
  }

  private setupFilterListeners(): void {
    this.filterForm.get('marca')?.valueChanges.subscribe((marca) => {
      if (marca) {
        this.catalogService.getModels(marca).subscribe({
          next: (response) => {
            this.models.set(response.data.modelos);
          },
        });
      } else {
        this.models.set([]);
        this.filterForm.patchValue({ modelo: '' });
      }
    });

    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.filterForm.patchValue({ page: 1 }, { emitEvent: false });
      this.loadCars();
    });
  }

  protected loadCars(): void {
    this.isLoading.set(true);

    const filters = this.buildFilters();

    this.carsService.getCars(filters).subscribe({
      next: (response) => {
        this.cars.set(response.data.data);
        this.pagination.set(response.data.pagination);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private buildFilters(): CarFilters {
    const formValue = this.filterForm.value;
    const filters: CarFilters = {};

    if (formValue.marca) filters.marca = formValue.marca;
    if (formValue.modelo) filters.modelo = formValue.modelo;
    if (formValue.anio) filters.anio = +formValue.anio;
    if (formValue.minPrecio) filters.minPrecio = +formValue.minPrecio;
    if (formValue.maxPrecio) filters.maxPrecio = +formValue.maxPrecio;
    if (formValue.color) filters.color = formValue.color;
    if (formValue.page) filters.page = +formValue.page;
    if (formValue.limit) filters.limit = +formValue.limit;

    return filters;
  }

  protected clearFilters(): void {
    this.filterForm.patchValue({
      marca: '',
      modelo: '',
      anio: '',
      minPrecio: '',
      maxPrecio: '',
      color: '',
      page: 1,
    });
  }

  protected goToPage(page: number): void {
    this.filterForm.patchValue({ page });
  }

  protected viewCar(car: Car): void {
    this.selectedCar.set(car);
    this.showViewModal.set(true);
  }

  protected closeViewModal(): void {
    this.showViewModal.set(false);
    this.selectedCar.set(null);
  }

  protected editCar(car: Car): void {
    this.router.navigate(['/cars/edit', car._id]);
  }

  protected confirmDelete(car: Car): void {
    this.selectedCar.set(car);
    this.showDeleteModal.set(true);
  }

  protected cancelDelete(): void {
    this.selectedCar.set(null);
    this.showDeleteModal.set(false);
  }

  protected deleteCar(): void {
    const car = this.selectedCar();
    if (!car) return;

    this.carsService.deleteCar(car._id).subscribe({
      next: () => {
        this.loadCars();
        this.cancelDelete();
      },
    });
  }

  protected formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  protected formatNumber(num: number): string {
    return new Intl.NumberFormat('es-MX').format(num);
  }
}
