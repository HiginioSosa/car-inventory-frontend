export interface Catalog {
  _id: string;
  marca: string;
  modelos: CatalogModel[];
}

export interface CatalogModel {
  nombre: string;
  isActive: boolean;
}

export interface BrandsResponse {
  marcas: string[];
}

export interface ModelsResponse {
  marca: string;
  modelos: string[];
}

export interface YearsResponse {
  anios: number[];
}
