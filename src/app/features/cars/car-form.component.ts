import {
  Component,
  signal,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarsService, CatalogService } from '../../core/services';
import { Car, CreateCarRequest, UpdateCarRequest } from '../../core/models';

@Component({
  selector: 'app-car-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './car-form.component.html',
})
export class CarFormComponent implements OnInit {
  private readonly carsService = inject(CarsService);
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly brands = signal<string[]>([]);
  protected readonly models = signal<string[]>([]);
  protected readonly years = signal<number[]>([]);
  protected readonly currentCar = signal<Car | null>(null);
  protected readonly imagePreview = signal<string | null>(null);
  protected readonly selectedFile = signal<File | null>(null);

  protected readonly isEditMode = computed(() => !!this.currentCar());
  protected readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Editar Auto' : 'Agregar Nuevo Auto'
  );

  protected readonly carForm = new FormGroup({
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl({ value: '', disabled: true }, [Validators.required]),
    anio: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    kilometraje: new FormControl('', [Validators.required, Validators.min(101)]),
    color: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
  });

  ngOnInit(): void {
    this.loadCatalogs();
    this.setupMarcaListener();

    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCar(carId);
    }
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

  private setupMarcaListener(): void {
    this.carForm.get('marca')?.valueChanges.subscribe((marca) => {
      const modeloControl = this.carForm.get('modelo');

      if (marca) {
        this.catalogService.getModels(marca).subscribe({
          next: (response) => {
            this.models.set(response.data.modelos);

            // Enable modelo field
            modeloControl?.enable();

            // Reset modelo if not in the new list
            const currentModelo = modeloControl?.value;
            if (currentModelo && !response.data.modelos.includes(currentModelo)) {
              this.carForm.patchValue({ modelo: '' });
            }
          },
        });
      } else {
        this.models.set([]);
        this.carForm.patchValue({ modelo: '' });
        // Disable modelo field when no brand is selected
        modeloControl?.disable();
      }
    });
  }

  private loadCar(id: string): void {
    this.isLoading.set(true);
    this.carsService.getCar(id).subscribe({
      next: (response) => {
        const car = response.data;
        this.currentCar.set(car);

        // Load models for the current brand first
        if (car.marca) {
          this.catalogService.getModels(car.marca).subscribe({
            next: (modelResponse) => {
              this.models.set(modelResponse.data.modelos);

              // Enable modelo control before setting value
              this.carForm.get('modelo')?.enable();

              // Then populate form
              this.carForm.patchValue({
                marca: car.marca,
                modelo: car.modelo,
                anio: car.anio.toString(),
                precio: car.precio.toString(),
                kilometraje: car.kilometraje.toString(),
                color: car.color || '',
                email: car.email,
                telefono: car.telefono,
              });
            },
          });
        }

        if (car.foto) {
          this.imagePreview.set(car.foto);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el auto');
        this.isLoading.set(false);
      },
    });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('El archivo es demasiado grande. Máximo 5MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage.set('Tipo de archivo no válido. Use JPG, PNG o WebP.');
        return;
      }

      this.selectedFile.set(file);
      this.errorMessage.set('');

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  protected removeImage(): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);

    // Reset file input
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  protected onSubmit(): void {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    if (this.isEditMode()) {
      this.updateCar();
    } else {
      this.createCar();
    }
  }

  private createCar(): void {
    const formValue = this.carForm.value;
    const carData: CreateCarRequest = {
      marca: formValue.marca!,
      modelo: formValue.modelo!,
      anio: +formValue.anio!,
      precio: +formValue.precio!,
      kilometraje: +formValue.kilometraje!,
      color: formValue.color || undefined,
      email: formValue.email!,
      telefono: formValue.telefono!,
      foto: this.selectedFile() || undefined,
    };

    this.carsService.createCar(carData).subscribe({
      next: () => {
        this.router.navigate(['/cars']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.customMessage || 'Error al crear el auto');
      },
    });
  }

  private updateCar(): void {
    const carId = this.currentCar()?._id;
    if (!carId) return;

    // Use getRawValue() to include disabled fields
    const formValue = this.carForm.getRawValue();
    const carData: UpdateCarRequest = {};

    // Only include changed fields
    if (formValue.marca) carData.marca = formValue.marca;
    if (formValue.modelo) carData.modelo = formValue.modelo;
    if (formValue.anio) carData.anio = +formValue.anio;
    if (formValue.precio) carData.precio = +formValue.precio;
    if (formValue.kilometraje) carData.kilometraje = +formValue.kilometraje;
    if (formValue.color !== undefined && formValue.color !== null) carData.color = formValue.color;
    if (formValue.email) carData.email = formValue.email;
    if (formValue.telefono) carData.telefono = formValue.telefono;
    if (this.selectedFile()) carData.foto = this.selectedFile()!;

    this.carsService.updateCar(carId, carData).subscribe({
      next: () => {
        this.router.navigate(['/cars']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.customMessage || 'Error al actualizar el auto');
      },
    });
  }

  protected getFieldError(fieldName: string): string {
    const field = this.carForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Email inválido';
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['pattern']) {
      if (fieldName === 'telefono') return 'Debe tener 10 dígitos';
    }

    return 'Campo inválido';
  }
}
