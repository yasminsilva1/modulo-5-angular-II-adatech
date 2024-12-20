import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SnackBarService } from '../../../../utils/snack-bar.service';
import { Product } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private productsService: ProductsService,
    private destroyRef: DestroyRef,
    private snakBarService: SnackBarService
  ) {}

  deleteProduct(id: string) {
    this.productsService
      .deleteProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.snakBarService.openSnackBar('Produto deletado!');
        },
        error: (err) => {
          this.snakBarService.openSnackBar('Erro ao deletar produto.');
          // console.error('Erro ao deletar produto: ', err);
        },
      });
  }
}
