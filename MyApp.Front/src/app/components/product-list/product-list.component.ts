import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Search and pagination
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  includeDeleted = signal(false);
  totalItems = signal(0);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getAll(
        this.searchTerm() || undefined,
        this.currentPage(),
        this.pageSize(),
        this.includeDeleted()
      )
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.totalItems.set(data.length);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load products. Please try again.');
          console.error('Error loading products:', err);
          this.loading.set(false);
        }
      });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    if (!target.value) {
      this.onSearch();
    }
  }

  toggleIncludeDeleted(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  changePage(direction: 'prev' | 'next'): void {
    const current = this.currentPage();
    if (direction === 'prev' && current > 1) {
      this.currentPage.set(current - 1);
      this.loadProducts();
    } else if (direction === 'next' && this.products().length === this.pageSize()) {
      this.currentPage.set(current + 1);
      this.loadProducts();
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.loading.set(true);
    this.productService.delete(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        this.error.set('Failed to delete product. Please try again.');
        console.error('Error deleting product:', err);
        this.loading.set(false);
      }
    });
  }

  exportToCsv(): void {
    const products = this.products();
    if (products.length === 0) {
      alert('No products to export');
      return;
    }

    const headers = ['Id', 'SKU', 'Name', 'Description', 'Price', 'Created At', 'Updated At', 'Is Deleted'];
    const rows = products.map(p => [
      p.id,
      p.sku,
      p.name,
      p.description || '',
      p.price,
      new Date(p.createdAtUtc).toLocaleString(),
      p.updatedAtUtc ? new Date(p.updatedAtUtc).toLocaleString() : '',
      p.isDeleted ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}

