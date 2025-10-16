import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Car,
  CreateCarRequest,
  UpdateCarRequest,
  CarFilters,
  CarStats,
  ApiResponse,
  PaginatedResponse,
} from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cars`;

  getCars(filters?: CarFilters): Observable<ApiResponse<PaginatedResponse<Car>>> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Car>>>(this.apiUrl, {
      params,
    });
  }

  getCar(id: string): Observable<ApiResponse<Car>> {
    return this.http.get<ApiResponse<Car>>(`${this.apiUrl}/${id}`);
  }

  createCar(carData: CreateCarRequest): Observable<ApiResponse<Car>> {
    const formData = this.buildFormData(carData);
    return this.http.post<ApiResponse<Car>>(this.apiUrl, formData);
  }

  updateCar(id: string, carData: UpdateCarRequest): Observable<ApiResponse<Car>> {
    const formData = this.buildFormData(carData);
    return this.http.put<ApiResponse<Car>>(`${this.apiUrl}/${id}`, formData);
  }

  deleteCar(id: string): Observable<ApiResponse<{ id: string; fechaEliminacion: string }>> {
    return this.http.delete<ApiResponse<{ id: string; fechaEliminacion: string }>>(
      `${this.apiUrl}/${id}`
    );
  }

  searchCars(query: string): Observable<ApiResponse<Car[]>> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<Car[]>>(`${this.apiUrl}/search`, {
      params,
    });
  }

  getStats(): Observable<ApiResponse<CarStats>> {
    return this.http.get<ApiResponse<CarStats>>(`${this.apiUrl}/stats`);
  }

  private buildFormData(data: CreateCarRequest | UpdateCarRequest): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'foto' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'foto') {
          formData.append(key, value.toString());
        }
      }
    });

    return formData;
  }
}
