import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.findAll().subscribe((data) => {
      this.products = data;
    });
  }

  onAddToCart(product: Product): void {
    // Handle add to cart
    console.log('Adding to cart:', product);
  }

  onViewDetails(productId: string): void {
    // Handle view details
    console.log('Viewing details for:', productId);
  }
}
