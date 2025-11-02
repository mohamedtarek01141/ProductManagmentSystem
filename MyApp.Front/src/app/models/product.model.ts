export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  createdAtUtc: string;
  updatedAtUtc?: string;
  isDeleted: boolean;
}

export interface ProductRequest {
  name: string;
  sku: string;
  description?: string;
  price: number;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
}

