import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Product } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-create',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './products-create.component.html',
  styleUrl: './products-create.component.css',
})
export class ProductsCreateComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    qty: new FormControl(null, [Validators.required, Validators.min(1)]),
    image: new FormControl(null, [Validators.required]),
  });

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  onSubmit(): void {
    const payload: Product = this.form.getRawValue();
    this.productsService.saveProduct(payload).subscribe({
      complete: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Erro ao cadastras novo produto: ', err);
      },
    });
  }

  cancelForm(): void {
    this.form.reset();
    this.router.navigate(['/products']);
  }
}
