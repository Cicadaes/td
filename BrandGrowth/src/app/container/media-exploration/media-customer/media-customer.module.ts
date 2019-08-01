import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { MediaCustomerContainerComponent } from './media-customer.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    MediaCustomerContainerComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: MediaCustomerContainerComponent
    }])
  ],
  exports: [
    MediaCustomerContainerComponent,
  ]
})
export class MediaCustomerContainerModule { }
