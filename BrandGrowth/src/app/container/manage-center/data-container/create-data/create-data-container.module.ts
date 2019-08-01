import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../config/shared/shared.module';
// import Components
import { CreateDataContainerComponent } from './create-data-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: CreateDataContainerComponent
    }])
  ],
  declarations: [CreateDataContainerComponent],
  exports: [
    CreateDataContainerComponent
  ]
})
export class CreateDataContainerModule { }