import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductRequest, Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  isEditMode = signal(false);
  productId = signal<number | null>(null);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      sku: ['', [Validators.required]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          description: product.description || '',
          price: product.price
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product. Please try again.');
        console.error('Error loading product:', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const productData: ProductRequest = this.productForm.value;

    const operation = this.isEditMode()
      ? this.productService.update(this.productId()!, productData)
      : this.productService.create(productData);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/products']);
        } else {
          this.error.set(response.message || 'Operation failed. Please try again.');
          this.loading.set(false);
        }
      },
      error: (err) => {
        let errorMessage = 'An error occurred. Please try again.';
        
        if (err.error?.errors) {
          // Handle validation errors from backend
          const errors = err.error.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    if (field.errors['maxlength']) {
      return `Maximum length is ${field.errors['maxlength'].requiredLength} characters`;
    }

    if (field.errors['min']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be greater than 0`;
    }

    return 'Invalid value';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}

