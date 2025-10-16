export interface Car {
  _id: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  kilometraje: number;
  color?: string;
  email: string;
  telefono: string;
  foto?: string;
  fechaAlta: string;
  fechaModificacion: string;
  fechaEliminacion: string | null;
  isDeleted: boolean;
}

export interface CreateCarRequest {
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  kilometraje: number;
  color?: string;
  email: string;
  telefono: string;
  foto?: File;
}

export interface UpdateCarRequest {
  marca?: string;
  modelo?: string;
  anio?: number;
  precio?: number;
  kilometraje?: number;
  color?: string;
  email?: string;
  telefono?: string;
  foto?: File;
}

export interface CarFilters {
  marca?: string;
  modelo?: string;
  anio?: number;
  minPrecio?: number;
  maxPrecio?: number;
  color?: string;
  page?: number;
  limit?: number;
  sortBy?: 'precio' | 'anio' | 'kilometraje' | 'fechaAlta';
  sortOrder?: 'asc' | 'desc';
}

export interface CarStats {
  total: number;
  deleted: number;
  active: number;
  averagePrice: number;
  averageKm: number;
}
