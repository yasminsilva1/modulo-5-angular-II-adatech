import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../utils/snack-bar.service';
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
export class ProductsCreateComponent implements OnInit {
  form: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    qty: new FormControl(null, [Validators.required, Validators.min(1)]),
    image: new FormControl(null, [Validators.required]),
  });

  id?: string;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private sanckBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.getProductById();
    }
  }

  getProductById(): void {
    this.productsService
      .getProductById(this.id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.form.patchValue(res);
        },
        error: (err) => {
          this.sanckBarService.openSnackBar('Erro ao carregar produto!');
          // console.error('Erro ao pegar produto pelo ID:', err);
        },
      });
  }

  onSubmit(): void {
    const payload: Product = this.form.getRawValue();
    if (this.id) {
      this.updateProduct(payload);
      return;
    }
    this.saveProduct(payload);
  }

  saveProduct(product: Product): void {
    this.productsService
      .saveProduct(product)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.sanckBarService.openSnackBar('Produto cadastrado com sucesso!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.sanckBarService.openSnackBar('Erro ao cadastrar produto!');
          // console.error('Erro ao cadastras novo produto: ', err);
        },
      });
  }

  updateProduct(product: Product): void {
    this.productsService
      .updateProduct(product)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.sanckBarService.openSnackBar('Produto atualizado com sucesso!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.sanckBarService.openSnackBar('Erro ao atualizar produto!');
          // console.error('Erro ao editar produto: ', err);
        },
      });
  }

  cancelForm(): void {
    this.form.reset();
    this.router.navigate(['/products']);
  }
}
