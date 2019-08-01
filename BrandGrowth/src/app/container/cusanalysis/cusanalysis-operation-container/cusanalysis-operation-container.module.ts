import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';
import { CusanalysisOperationContainerComponent } from './cusanalysis-operation-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: CusanalysisOperationContainerComponent,
    }])
  ],
  declarations: [CusanalysisOperationContainerComponent],
})
export class CusanalysisOperationContainerModule { }