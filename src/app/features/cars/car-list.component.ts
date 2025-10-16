import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { CarsService, CatalogService } from '../../core/services';
import { Car, CarFilters, Pagination } from '../../core/models';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-car-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CapitalizePipe],
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

  protected hasFilters(): boolean {
    const values = this.filterForm.value;
    return Boolean(
      values.marca ||
        values.modelo ||
        values.anio ||
        values.minPrecio ||
        values.maxPrecio ||
        values.color
    );
  }

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
    // Inicialmente deshabilitar el control de modelo
    this.filterForm.get('modelo')?.disable();

    this.filterForm.get('marca')?.valueChanges.subscribe((marca) => {
      if (marca) {
        this.catalogService.getModels(marca).subscribe({
          next: (response) => {
            this.models.set(response.data.modelos);
            this.filterForm.get('modelo')?.enable();
          },
        });
      } else {
        this.models.set([]);
        this.filterForm.patchValue({ modelo: '' });
        this.filterForm.get('modelo')?.disable();
      }
    });

    // Escuchar cambios solo en los filtros (no en page y limit)
    const filterControls = ['marca', 'modelo', 'anio', 'minPrecio', 'maxPrecio', 'color'];
    filterControls.forEach((controlName) => {
      this.filterForm
        .get(controlName)
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe(() => {
          // Resetear a página 1 cuando cambian los filtros
          this.filterForm.patchValue({ page: 1 }, { emitEvent: false });
          this.loadCars();
        });
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
    this.filterForm.patchValue({ page }, { emitEvent: false });
    this.loadCars();
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

  protected getColorClasses(color: string | undefined): string {
    if (!color) {
      return 'bg-gray-100 text-gray-700';
    }

    const colorLower = color.toLowerCase().trim();

    const colorMap: { [key: string]: string } = {
      // Rojos
      rojo: 'bg-red-100 text-red-800',
      red: 'bg-red-100 text-red-800',
      carmesí: 'bg-red-200 text-red-900',
      crimson: 'bg-red-200 text-red-900',
      vino: 'bg-red-900 text-red-100',
      burgundy: 'bg-red-900 text-red-100',

      // Azules
      azul: 'bg-blue-100 text-blue-800',
      blue: 'bg-blue-100 text-blue-800',
      marino: 'bg-blue-900 text-blue-100',
      navy: 'bg-blue-900 text-blue-100',
      celeste: 'bg-sky-100 text-sky-800',
      sky: 'bg-sky-100 text-sky-800',
      turquesa: 'bg-cyan-100 text-cyan-800',
      turquoise: 'bg-cyan-100 text-cyan-800',
      aqua: 'bg-cyan-100 text-cyan-800',

      // Verdes
      verde: 'bg-green-100 text-green-800',
      green: 'bg-green-100 text-green-800',
      esmeralda: 'bg-emerald-100 text-emerald-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      lima: 'bg-lime-100 text-lime-800',
      lime: 'bg-lime-100 text-lime-800',
      oliva: 'bg-green-700 text-green-100',
      olive: 'bg-green-700 text-green-100',

      // Amarillos y Dorados
      amarillo: 'bg-yellow-100 text-yellow-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      dorado: 'bg-amber-200 text-amber-900',
      gold: 'bg-amber-200 text-amber-900',
      oro: 'bg-amber-200 text-amber-900',
      champagne: 'bg-yellow-50 text-yellow-800',
      champaña: 'bg-yellow-50 text-yellow-800',

      // Naranjas
      naranja: 'bg-orange-100 text-orange-800',
      orange: 'bg-orange-100 text-orange-800',
      coral: 'bg-orange-200 text-orange-900',
      durazno: 'bg-orange-100 text-orange-700',
      peach: 'bg-orange-100 text-orange-700',

      // Morados
      morado: 'bg-purple-100 text-purple-800',
      purple: 'bg-purple-100 text-purple-800',
      violeta: 'bg-violet-100 text-violet-800',
      violet: 'bg-violet-100 text-violet-800',
      lila: 'bg-purple-200 text-purple-800',
      lavanda: 'bg-purple-100 text-purple-700',
      lavender: 'bg-purple-100 text-purple-700',

      // Rosas
      rosa: 'bg-pink-100 text-pink-800',
      pink: 'bg-pink-100 text-pink-800',
      magenta: 'bg-fuchsia-100 text-fuchsia-800',
      fucsia: 'bg-fuchsia-100 text-fuchsia-800',

      // Negros y Grises
      negro: 'bg-gray-800 text-white',
      black: 'bg-gray-800 text-white',
      gris: 'bg-gray-200 text-gray-800',
      gray: 'bg-gray-200 text-gray-800',
      grafito: 'bg-gray-600 text-gray-100',
      graphite: 'bg-gray-600 text-gray-100',
      carbón: 'bg-gray-700 text-gray-100',
      charcoal: 'bg-gray-700 text-gray-100',
      plata: 'bg-gray-300 text-gray-800',
      silver: 'bg-gray-300 text-gray-800',
      plateado: 'bg-gray-300 text-gray-800',

      // Blancos y Cremas
      blanco: 'bg-gray-50 text-gray-800 border border-gray-300',
      white: 'bg-gray-50 text-gray-800 border border-gray-300',
      perla: 'bg-gray-100 text-gray-700 border border-gray-200',
      pearl: 'bg-gray-100 text-gray-700 border border-gray-200',
      crema: 'bg-amber-50 text-amber-800',
      cream: 'bg-amber-50 text-amber-800',
      marfil: 'bg-yellow-50 text-yellow-900',
      ivory: 'bg-yellow-50 text-yellow-900',

      // Marrones y Beige
      marrón: 'bg-amber-100 text-amber-800',
      brown: 'bg-amber-100 text-amber-800',
      café: 'bg-amber-100 text-amber-800',
      coffee: 'bg-amber-100 text-amber-800',
      beige: 'bg-amber-50 text-amber-800',
      bronce: 'bg-orange-800 text-orange-100',
      bronze: 'bg-orange-800 text-orange-100',
      cobre: 'bg-orange-700 text-orange-100',
      copper: 'bg-orange-700 text-orange-100',
    };

    for (const [key, value] of Object.entries(colorMap)) {
      if (colorLower.includes(key)) {
        return value;
      }
    }

    return 'bg-gray-100 text-gray-700';
  }
}
