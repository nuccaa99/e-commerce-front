import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './pages/products-list/products-list.component';

@NgModule({
  declarations: [ProductsListComponent],
  imports: [CommonModule, ProductRoutingModule],
})
export class ProductsModule {}
