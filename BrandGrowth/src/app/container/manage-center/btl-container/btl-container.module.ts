import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';
// import Components
import { BtlContainerComponent } from './btl-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: BtlContainerComponent,
      },
    ])
  ],
  declarations: [
    BtlContainerComponent,
  ]
})
export class BtlContainerModule { }