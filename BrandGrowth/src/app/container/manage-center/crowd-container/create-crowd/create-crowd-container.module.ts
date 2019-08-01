import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../config/shared/shared.module';
// import Components
import { CreateCrowdContainerComponent } from './create-crowd-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: CreateCrowdContainerComponent,
    }])
  ],
  declarations: [
    CreateCrowdContainerComponent,
  ],
  exports: [
    CreateCrowdContainerComponent,
  ],
})
export class CreateCrowdContainerModule { }