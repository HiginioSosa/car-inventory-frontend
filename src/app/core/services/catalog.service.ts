import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Catalog, BrandsResponse, ModelsResponse, YearsResponse, ApiResponse } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalogs`;

  getBrands(): Observable<ApiResponse<BrandsResponse>> {
    return this.http.get<ApiResponse<BrandsResponse>>(`${this.apiUrl}/brands`);
  }

  getModels(marca: string): Observable<ApiResponse<ModelsResponse>> {
    return this.http.get<ApiResponse<ModelsResponse>>(`${this.apiUrl}/models/${marca}`);
  }

  getYears(): Observable<ApiResponse<YearsResponse>> {
    return this.http.get<ApiResponse<YearsResponse>>(`${this.apiUrl}/years`);
  }

  getCatalogs(): Observable<ApiResponse<{ catalogs: Catalog[] }>> {
    return this.http.get<ApiResponse<{ catalogs: Catalog[] }>>(this.apiUrl);
  }

  initializeCatalogs(): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/initialize`, {});
  }
}
