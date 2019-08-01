import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { AuthContainerComponent } from './auth-container.component';

// import Contants
import { AUTH_ROUTE } from './auth_route';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(AUTH_ROUTE)
  ],
  declarations: [
    AuthContainerComponent,
  ]
})
export class AuthContainerModule { }