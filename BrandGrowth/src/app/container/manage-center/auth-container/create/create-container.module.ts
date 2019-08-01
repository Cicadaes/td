import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { CreateContainerComponent } from './create-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: CreateContainerComponent
    }])
  ],
  declarations: [
    CreateContainerComponent,
  ]
})
export class CreateContainerModule { }