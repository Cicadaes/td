import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../config/shared/shared.module';
// import Components
import { CreateBtlContainerComponent } from './create-btl-container.component';
import { ProbeOperationContainerComponent } from '../probe-operation-container/probe-operation-container.component';
import { PoiOperationContainerComponent } from '../poi-operation-container/poi-operation-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: CreateBtlContainerComponent,
    }])
  ],
  declarations: [
    CreateBtlContainerComponent,
    ProbeOperationContainerComponent,
    PoiOperationContainerComponent,
  ],
  exports: [
    CreateBtlContainerComponent,
    ProbeOperationContainerComponent,
    PoiOperationContainerComponent,
  ],
})
export class CreateBtlContainerModule { }