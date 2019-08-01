import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';

// 详情
import { CusanalysisDetailsContainerComponent } from './cusanalysis-details-container.component';
// 电商
import { BusinessDetailsContainerComponent } from './business-details-container/business-details-container.component';
// 设备
import { DeviceDetailsContainerComponent } from './device-details-container/device-details-container.component';
// 基本
import { BaseDetailsContainerComponent } from './base-details-container/base-details-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CusanalysisDetailsContainerComponent,
      },
    ]),
  ],
  declarations: [
    CusanalysisDetailsContainerComponent,
    BusinessDetailsContainerComponent,
    DeviceDetailsContainerComponent,
    BaseDetailsContainerComponent,
],
  entryComponents: [
    BusinessDetailsContainerComponent,
    DeviceDetailsContainerComponent,
    BaseDetailsContainerComponent,
  ],
})
export class CusanalysisDetailsContainerModule { }