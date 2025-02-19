import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { BasketComponent } from './pages/basket/basket.component';

@NgModule({
  declarations: [ProfileComponent, BasketComponent],
  imports: [CommonModule, UserRoutingModule],
})
export class UsersModule {}
