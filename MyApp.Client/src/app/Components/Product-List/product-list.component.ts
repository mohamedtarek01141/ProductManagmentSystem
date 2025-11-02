import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  search = '';
  includeDeleted = false;
  loading = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getAll(this.search, this.includeDeleted).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load products. Please check your API connection.';
        console.error(err);
      }
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  toggleDeleted(): void {
    this.includeDeleted = !this.includeDeleted;
    this.loadProducts();
  }
}
