import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, MatButtonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent {
  products$ = this.productsService.products$;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.loadProductList();
  }

  trackById(product: Product): string {
    return product.id!;
  }
}
