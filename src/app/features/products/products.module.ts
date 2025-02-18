import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ProductsListComponent, ProductCardComponent],
  imports: [CommonModule, ProductRoutingModule, MatIconModule],
})
export class ProductsModule {}
